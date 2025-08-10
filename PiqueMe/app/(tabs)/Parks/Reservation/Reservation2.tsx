import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { createReservation } from '@/app/utils/firebaseUtils'; // assure que createReservation exporté
import Header from '@/app/components/Header';

/* ---------- Types ---------- */
type Slot = {
    start: Date;
    end: Date;
    status: 'disponible' | 'reserve' | 'selectionne';
};

type Period = 'morning' | 'afternoon' | 'evening';

/* ---------- Helpers ---------- */
const setTime = (base: Date, hour: number, minute = 0) => {
    const d = new Date(base);
    d.setHours(hour, minute, 0, 0);
    return d;
};

const getPeriodTime = (date: Date, period: Period) => {
    if (period === 'morning') return { start: setTime(date, 8, 0), end: setTime(date, 12, 0) };
    if (period === 'afternoon') return { start: setTime(date, 12, 0), end: setTime(date, 16, 0) };
    return { start: setTime(date, 16, 0), end: setTime(date, 20, 0) };
};

const generateHalfHourSlots = (start: Date, end: Date) => {
    const slots: Slot[] = [];
    let cur = new Date(start);
    while (cur < end) {
        const next = new Date(cur.getTime() + 30 * 60000);
        if (next > end) break;
        slots.push({ start: new Date(cur), end: next, status: 'disponible' });
        cur = next;
    }
    return slots;
};

// Convert slot -> Firestore Timestamp for comparison
const slotOverlaps = (slotStart: Date, slotEnd: Date, resStart: Date, resEnd: Date) => {
    return slotStart < resEnd && resStart < slotEnd;
};

/* ---------- Component ---------- */
export default function Reservation2() {
    const router = useRouter();
    const params = useLocalSearchParams() as {
        idParc?: string;
        idSpot?: string; // id de l'aire/spot si tu veux
        spotLabel?: string;
    };
    const idParc = params.idParc || '';
    const idSpot = params.idSpot || 'Non fourni';
    const spotLabel = params.spotLabel || 'Spot';

    const today = React.useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [selectedPeriod, setSelectedPeriod] = React.useState<Period | null>(null);
    const [slots, setSlots] = React.useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null);
    const [loading, setLoading] = React.useState(false);

    // Récupérer reservations existantes pour idParc + date
    const fetchReservationsForDate = React.useCallback(
        async (parkId: string, date: Date) => {
            if (!parkId) return [];
            // startOfDay..endOfDay
            const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);

            const q = query(
                collection(db, 'reservations'),
                where('idParc', '==', parkId),
                where('dateDebut', '>=', Timestamp.fromDate(startOfDay)),
                where('dateDebut', '<', Timestamp.fromDate(endOfDay))
            );
            try {
                const snaps = await getDocs(q);
                // map to local simple intervals
                const reservedIntervals: { start: Date; end: Date }[] = snaps.docs.map(d => {
                    const data = d.data();
                    const dbStart = (data.dateDebut as any)?.toDate ? (data.dateDebut as any).toDate() : new Date(data.dateDebut);
                    const dbEnd = (data.dateFin as any)?.toDate ? (data.dateFin as any).toDate() : new Date(data.dateFin);
                    return { start: dbStart, end: dbEnd };
                });
                return reservedIntervals;
            } catch (e) {
                console.error('fetchReservationsForDate', e);
                return [];
            }
        },
        []
    );

    // Génère slots quand date ou période change, puis marque réservés
    React.useEffect(() => {
        let mounted = true;
        const build = async () => {
            setLoading(true);
            setSelectedSlot(null);
            if (!selectedPeriod) {
                setSlots([]);
                setLoading(false);
                return;
            }
            const { start, end } = getPeriodTime(selectedDate, selectedPeriod);
            let generated = generateHalfHourSlots(start, end);

            // fetch existing reservations to mark reserved slots
            const reserved = await fetchReservationsForDate(idParc, selectedDate);
            // for each slot, if it overlaps any reserved interval, mark as reserved
            generated = generated.map(s => {
                const isReserved = reserved.some(r => slotOverlaps(s.start, s.end, r.start, r.end));
                return { ...s, status: isReserved ? 'reserve' : 'disponible' } as Slot;
            });

            if (mounted) setSlots(generated);
            setLoading(false);
        };

        build();
        return () => { mounted = false; };
    }, [selectedDate, selectedPeriod, idParc, fetchReservationsForDate]);

    /* ---------- User interactions ---------- */
    const onChangeDate = (_: any, date?: Date) => {
        setShowDatePicker(false);
        if (!date) return;
        // only allow today or future
        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);
        if (selected < today) {
            Alert.alert('Date invalide', 'Veuillez choisir une date aujourd’hui ou dans le futur.');
            return;
        }
        setSelectedDate(date);
    };

    const onSelectPeriod = (p: Period) => {
        setSelectedPeriod(p);
    };

    const onToggleSlot = (s: Slot) => {
        if (s.status === 'reserve') return; // can't select reserved
        // if clicking an already selected slot -> deselect
        if (selectedSlot && selectedSlot.start.getTime() === s.start.getTime()) {
            setSelectedSlot(null);
            setSlots(prev => prev.map(x => x.start.getTime() === s.start.getTime() ? { ...x, status: 'disponible' } : x));
            return;
        }
        // select this slot, deselect others
        setSelectedSlot(s);
        setSlots(prev => prev.map(x => {
            if (x.start.getTime() === s.start.getTime()) return { ...x, status: 'selectionne' };
            if (x.status === 'selectionne') return { ...x, status: 'disponible' };
            return x;
        }));
    };

    const onClearSelection = () => {
        setSelectedSlot(null);
        setSlots(prev => prev.map(x => x.status === 'selectionne' ? { ...x, status: 'disponible' } : x));
    };

    const confirmReservation = async () => {
        if (!selectedSlot) {
            Alert.alert('Aucun créneau', "Veuillez sélectionner un créneau avant de confirmer.");
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Non connecté', 'Vous devez être connecté pour réserver.');
            return;
        }

        // createReservation expects Dates
        try {
            setLoading(true);
            console.log("Informations de reservation: " + idParc, ' ', selectedSlot.start, ' ', selectedSlot.end, ' ', user.uid);
            const res = await createReservation(idParc, idSpot, spotLabel, selectedSlot.start, selectedSlot.end, user.uid);
            console.log(res);
            setLoading(false);
            if (res?.success) {
                Alert.alert('Succès', 'Réservation créée.');
                // optionally go back or refresh slots to mark reserved
                // refresh slots for current date/period
                setSelectedSlot(null);
                setSelectedPeriod(null);
                // re-run effect by toggling date (quick trick) or re-fetch manually:
            } else {
                Alert.alert('Erreur', res?.message || 'Erreur lors de la création.');
            }
        } catch (e) {
            setLoading(false);
            console.error(e);
            Alert.alert('Erreur', 'Impossible de créer la réservation.');
        }
    };

    /* ---------- UI rendering helpers ---------- */
    const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatDate = (d: Date) => d.toLocaleDateString();

    // Build "table" columns: hours array between period start and period end (integer hours)
    const columns = React.useMemo(() => {
        if (!selectedPeriod) return [] as number[];
        const { start, end } = getPeriodTime(selectedDate, selectedPeriod);
        const startH = start.getHours();
        const endH = end.getHours();
        const arr: number[] = [];
        for (let h = startH; h < endH; h++) arr.push(h);
        return arr;
    }, [selectedPeriod, selectedDate]);

    /* ---------- Render ---------- */
    return (
        <>
            <Header title={undefined}/>

            <View style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Confirmer un créneau</Text>
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    {/* Date picker */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                            <Text>{formatDate(selectedDate)}</Text>
                            <Text style={styles.small}>Changer</Text>
                        </TouchableOpacity>
                        {/* Adapter en fonction du telephone*/}
                        {showDatePicker && Platform.OS === 'ios' && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="spinner"
                                onChange={onChangeDate}
                                minimumDate={today}
                            />
                        )}

                        {showDatePicker && Platform.OS === 'android' && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="calendar"
                                onChange={onChangeDate}
                                minimumDate={today}
                            />
                        )}
                    </View>

                    {/* Period buttons */}
                    {!selectedPeriod && <Text style={styles.label}>Choisissez une période</Text>}

                    <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <TouchableOpacity
                            onPress={() => onSelectPeriod('morning')}
                            style={[styles.periodButton, selectedPeriod === 'morning' && styles.periodButtonActive]}>
                            <Text style={selectedPeriod === 'morning' ? styles.periodTextActive : styles.periodText}>
                                Matin
                            </Text>
                            <Text style={styles.small}>8h - 12h</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onSelectPeriod('afternoon')}
                            style={[styles.periodButton, selectedPeriod === 'afternoon' && styles.periodButtonActive]}>
                            <Text style={selectedPeriod === 'afternoon' ? styles.periodTextActive : styles.periodText}>
                                Après-midi
                            </Text>
                            <Text style={styles.small}>12h - 16h</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onSelectPeriod('evening')}
                            style={[styles.periodButton, selectedPeriod === 'evening' && styles.periodButtonActive]}>
                            <Text style={selectedPeriod === 'evening' ? styles.periodTextActive : styles.periodText}>
                                Soir
                            </Text>
                            <Text style={styles.small}>16h - 20h</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Slots table */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Plages horaires</Text>

                        {loading && <ActivityIndicator />}


                        {selectedPeriod && !loading && (
                            <ScrollView horizontal style={styles.tableScroll}>
                                {/* columns */}
                                {columns.map((hour) => (
                                    <View key={hour} style={styles.column}>
                                        <View style={styles.hourHeader}><Text style={styles.hourText}>{`${hour}:00`}</Text></View>

                                        {/* two rows: :00 and :30 */}
                                        {[0, 30].map(min => {
                                            const slot = slots.find(s => s.start.getHours() === hour && s.start.getMinutes() === min);
                                            const bg =
                                                slot?.status === 'reserve' ? '#e74c3c' :
                                                    slot?.status === 'selectionne' ? '#f39c12' : '#51ba4a';
                                            return (
                                                <TouchableOpacity
                                                    key={min}
                                                    style={[styles.slot, { backgroundColor: bg }]}
                                                    onPress={() => slot && onToggleSlot(slot)}
                                                    disabled={!slot || slot.status === 'reserve'}
                                                >
                                                    <Text style={styles.slotText}>
                                                        {slot ? formatTime(slot.start) : '--:--'}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* Legend */}
                    <View style={[styles.section, styles.legendRow]}>
                        <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#51ba4a' }]} /><Text>Disponible</Text></View>
                        <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#e74c3c' }]} /><Text>Non disponible</Text></View>
                        <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#f39c12' }]} /><Text>Votre réservation</Text></View>
                    </View>

                    {/* Selected summary */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Votre choix</Text>
                        {selectedSlot ? (
                            <View style={styles.selectionRow}>
                                <Text style={styles.selectionText}>
                                    {`${spotLabel || 'Spot'}: ${formatTime(selectedSlot.start)} le ${formatDate(selectedSlot.start)} ` +
                                        `jusqu'à ${formatTime(selectedSlot.end)} ${formatDate(selectedSlot.end)}`}
                                </Text>
                                <TouchableOpacity onPress={onClearSelection} style={styles.trashButton}>
                                    <Ionicons name="trash" size={20} color="#333" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text>Aucune sélection</Text>
                        )}
                    </View>

                </ScrollView>

                {/* Confirm button */}
                <TouchableOpacity style={styles.confirmButton} onPress={confirmReservation}>
                    <Text style={styles.confirmText}>{loading ? 'Enregistrement...' : 'Envoyer réservation'}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#fff' },
    header: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderColor: '#eee' },
    headerTitle: { fontSize: 20, fontWeight: '600', marginLeft: 12 },
    container: { paddingBottom: 120, padding: 12 },
    section: { marginTop: 12, marginBottom: 6 },
    label: { fontWeight: '700', marginVertical: 8 },
    dateButton: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    small: { fontSize: 15, color: '#666' },

    periodButton: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginHorizontal: 4, alignItems: 'center' },
    periodButtonActive: { backgroundColor: '#98C379', borderColor: '#98C379' },
    periodText: { fontWeight: '600' },
    periodTextActive: { color: '#fff', fontWeight: '700' },

    tableScroll: { marginTop: 8, maxHeight: 220 },
    column: { width: 100, marginRight: 6, borderWidth: 1, borderColor: '#eee', borderRadius: 6, overflow: 'hidden' },
    hourHeader: { padding: 6, backgroundColor: '#fafafa', borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    hourText: { fontWeight: '700' },
    slot: { height: 70, alignItems: 'center', justifyContent: 'center' },
    slotText: { color: '#fff', fontWeight: '700' },

    legendRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendBox: { width: 20, height: 12, marginRight: 6 },

    selectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectionText: { flex: 1 },
    trashButton: { padding: 8 },

    confirmButton: { position: 'absolute', right: 16, bottom: 20, backgroundColor: 'black', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24 },
    confirmText: { color: '#fff', fontWeight: '700' },
});
