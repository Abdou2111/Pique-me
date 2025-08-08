/* app/(tabs)/Search.tsx */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Dimensions,
    StyleSheet,
    InteractionManager
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as geofire from 'geofire-common';
import * as Location from 'expo-location';
import {
    Gesture,
    GestureDetector,
    Directions,
    PanGestureChangeEventPayload,
    PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { router, useSegments } from 'expo-router';
import { useSheet } from '@/app/stores/useSheet';
import { useNavigation, useRoute } from '@react-navigation/native';

/* components */
import SearchBar from '../components/SearchBar';
import ParcList  from '../components/ParcList';

/* ─── Firebase ── */
import {
    collection,
    getDocs,
    query,
    orderBy,
    startAt,
    endAt,
    DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {SHEET_COMPAT_ALL} from "react-native-screens/lib/typescript/components/helpers/sheet";

/* ─── Types ── */
type Park = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    tags: string[];
    filters: string[];
};

/* ─── Tags disponibles ── */
const FILTERS = [
    { id: 'aireJeu',    label: 'Aire de jeu',  icon: 'game-controller' },
    { id: 'recreatif',  label: 'Récréatif',    icon: 'basketball'      },
    { id: 'pleinAir',   label: 'Plein air',    icon: 'leaf'            },
    { id: 'piqueNique', label: 'Pique-nique',  icon: 'restaurant'      },
] as const;

/* mapping installation.TYPE → id de tag */
const toTag = (t: unknown): string | null => {
    const s = (String(t ?? '')).toLowerCase();
    if (s.includes('aire de jeu')) return 'aireJeu';
    if (s.includes('récréatif'))   return 'recreatif';
    if (s.includes('plein air'))   return 'pleinAir';
    if (s.includes('pique-nique')) return 'piqueNique';
    return null;
};

const norm = (s: string) =>
    s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

/* helper: convert Firestore data → UI model, avec fallback docId si NUM_INDEX absent */
const asPark = (p, fallbackId) => ({
    id:   String(p.NUM_INDEX ?? fallbackId ?? p.id),
    name: p.Nom,
    lat:  p.centroid?.lat,
    lng:  p.centroid?.lng,
    tags: (p.installations ?? [])
        .map(i => toTag(i.TYPE))
        .filter(Boolean),
    filters: (p.installations ?? [])
        .map(i => toTag(i.TYPE))
        .filter(Boolean),
});

/* tiny utility – returns parks whose geohash falls in `region` */
async function fetchParksInRegion(region: Region): Promise<Park[]> {
    const center  = [region.latitude, region.longitude];
    const radiusM = Math.max(region.latitudeDelta, region.longitudeDelta) * 55_000;

    // @ts-ignore
    const bounds   = geofire.geohashQueryBounds(center, radiusM);
    const snaps    = await Promise.all(
        bounds.map(([start, end]) =>
            getDocs(
                query(
                    collection(db, 'parks'),
                    orderBy('geohash'),
                    startAt(start),
                    endAt(end),
                ),
            ),
        ),
    );

    const snaps = await Promise.all(promises);
    return snaps.flatMap(s => s.docs.map(d => asPark(d.data(), d.id)));
}

/* merge two arrays without duplicates (by id) */
const mergeById = (oldArr: Park[], newArr: Park[]): Park[] => {
    const map = new Map<string, Park>(oldArr.map(p => [p.id, p]));
    newArr.forEach(p => map.set(p.id, p));
    return [...map.values()];
};

/* km → degrees latitude (≈ 111 km ≙ 1 ° lat) */
const km2degLat  = (km: number) => km / 111;
/* adjust long delta by cos φ so window looks square */
const km2degLng  = (km: number, lat: number) => km / (111 * Math.cos(lat * Math.PI / 180));

/* ─────────────────────────────────────────────────────────────────────── */
export default function Search() {
    const insets = useSafeAreaInsets();

    /* UI state */
    const [queryText,  setQueryText]  = useState('');
    const [active, setActive] = useState(new Set());
    const [region, setRegion] = useState(null);

    /* data state */
    const [parks, setParks] = useState<Park[]>([]);

    /* ask for location once on mount */
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') throw new Error('permission denied');

                const { coords } = await Location.getCurrentPositionAsync({});
                const latDelta = km2degLat(1);
                const lngDelta = km2degLng(1, coords.latitude);
                setRegion({
                    latitude:       coords.latitude,
                    longitude:      coords.longitude,
                    latitudeDelta:  latDelta,
                    longitudeDelta: lngDelta,
                });
            } catch (e) {
                console.warn('Location error, falling back to Montréal:', e);
                const latDelta = km2degLat(2);
                setRegion({
                    latitude:       45.5019,
                    longitude:     -73.5674,
                    latitudeDelta:  latDelta,
                    longitudeDelta: latDelta,
                });
            }
        })();
    }, []);

    /* staged fetch: viewport first, full dump after first frame */
    useEffect(() => {
        if (!region) return;
        const load = async () => {
            const initial = await fetchParksInRegion(region);
            setParks(initial);

            InteractionManager.runAfterInteractions(async () => {
<<<<<<< HEAD:PiqueMe/app/(tabs)/Search.tsx
                const snap = await getDocs(collection(db, 'parks'));
                const all  = snap.docs.map(d => asPark(d.data()));
                setParks(prev => mergeById(prev, all));
=======
                const snapshot = await getDocs(collection(db, 'parks'));
                const allParks = snapshot.docs.map(d => asPark(d.data(), d.id));
                setParks(prev => mergeById(prev, allParks));
>>>>>>> 6cff355e (integration du feedback pour la home page et la page de profil, gestion des favoris):PiqueMe/app/(tabs)/Search.js
            });
        };
        load();
    }, [region]);

    /* helper – inside viewport? */
    const inside = useCallback(
        (p: Park, r: Region | null): boolean => {
            if (!r) return false;

            const halfLat = r.latitudeDelta  / 2;
            const halfLng = r.longitudeDelta / 2;
            return (
                p.lat >= r.latitude  - halfLat &&
                p.lat <= r.latitude  + halfLat &&
                p.lng >= r.longitude - halfLng &&
                p.lng <= r.longitude + halfLng
            );
        },
        [],
    );

    /* filtered list for markers + bottom sheet */
    const shown = useMemo(
        () =>
            parks.filter(
                p =>
                    inside(p, region) &&
                    (!queryText || norm(p.name).includes(norm(queryText))) &&
                    (![...active].length || [...active].every(t => p.tags.includes(t))),
            ),
        [parks, region, queryText, active, inside],
    );

    const toggle = (id: string) => {
        const n = new Set(active);
        n.has(id) ? n.delete(id) : n.add(id);
        setActive(n);
    };

    /* ---------- bottom-sheet behaviour (FLING) ---------------------------- */
    /* bottom-sheet sizing */
    const COLLAPSED_H = 59;                         // handle + “X Résultats” row

    /* translateY snap points */
    const SNAP_TOP    = 0;                          // fully on-screen
    const SNAP_PEEK   = SHEET_H - COLLAPSED_H;      // only header visible

    const navigation = useNavigation();
    const route      = useRoute();
    const { setFns } = useSheet();

    /* share expand / collapse so the tab bar can invoke them */
    useEffect(() => {
        setFns({
            expand:   () => { y.value = withSpring(SNAP_TOP);   },
            collapse: () => { y.value = withSpring(SNAP_PEEK); },
        });
    }, []);

    /* helper to highlight the correct tab after a fling */
    const [, parent] = useSegments();            // e.g. ['(tabs)', 'SearchPage']
    const activate = (route: '/Search' | '/Parks') => {
        if (parent !== route.slice(1)) router.navigate(route);
    };

    /* shared value */
    const y = useSharedValue<number>(SNAP_PEEK);

    const flingUp = Gesture.Fling()
        .direction(Directions.UP)
        .onEnd(() => {
            y.value = withSpring(SNAP_TOP, {});
        });

    const flingDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onEnd(() => {
            y.value = withSpring(SNAP_PEEK, {});
        });

    const sheetGesture = Gesture.Simultaneous(flingUp, flingDown);

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: y.value }],
    }));


    /* --------------------------- UI -------------------------------------- */
    return (
        <SafeAreaView style={S.flex}>
            {region && (
                <MapView
                    style={S.map}
                    initialRegion={region}
                    onRegionChangeComplete={setRegion}
                    showsUserLocation
                    showsMyLocationButton
                    followsUserLocation={false}
                >
                    {shown.map((p, i) => (
                        <Marker
                            key={`${p.id}-${i}`}
                            coordinate={{ latitude: p.lat, longitude: p.lng }}
                            title={p.name}
                        />
                    ))}
                </MapView>
            )}

            {/* search bar + chips */}
            <View style={[S.topOverlay, { top: insets.top + 8 }]}>
                <SearchBar
                    value={queryText}
                    onChange={setQueryText}
                    placeholder="Rechercher des parcs…"
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={S.tagRow}
                >
                    {FILTERS.map(t => {
                        const on = active.has(t.id);
                        return (
                            <Pressable
                                key={t.id}
                                onPress={() => toggle(t.id)}
                                style={[S.chip, on && S.chipOn]}
                            >
                                <Ionicons
                                    name={on ? t.icon : `${t.icon}-outline`}
                                    size={16}
                                    color={on ? '#fff' : '#444'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[S.txt, on && S.txtOn]}>{t.label}</Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* draggable bottom sheet */}
            <GestureDetector gesture={sheetGesture}>
                <Animated.View style={[S.listPanel, sheetStyle]}>
                    <View style={S.header}>
                        <View style={S.handle} />
                        <Text style={S.title}>{shown.length} Résultats</Text>
                    </View>

<<<<<<< HEAD:PiqueMe/app/(tabs)/Search.tsx
                    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                        <ParcList
                            parks={shown}
                            filterQuery={norm(query)}
                            filterTags={[...active]}
                            useFavorisCard
                        />
                    </ScrollView>
                </Animated.View>
            </GestureDetector>
=======
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <ParcList
                        parks={shown}                         // ← id = String(NUM_INDEX || doc.id)
                        filterQuery={norm(queryText)}
                        filterTags={[...active]}
                        useFavorisCard
                    />
                </ScrollView>
            </View>
>>>>>>> 6cff355e (integration du feedback pour la home page et la page de profil, gestion des favoris):PiqueMe/app/(tabs)/Search.js
        </SafeAreaView>
    );
}


const SCREEN_H    = Dimensions.get('window').height;
const SHEET_H     = SCREEN_H * 0.85;            // sheet’s full height

/* ── styles ── */
const S = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#fff' },
    map:  StyleSheet.absoluteFillObject,

    topOverlay: { position: 'absolute', width: '100%', paddingHorizontal: 12 },
    tagRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 22,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipOn: { backgroundColor: '#0f6930' },

    txt:   { fontSize: 12, color: '#444' },
    txtOn: { color: '#fff', fontWeight: '600' },

    listPanel: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        height: SHEET_H,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        paddingHorizontal: 12,
        paddingTop: 8,
    },

    header: { alignItems: 'center', paddingTop: 6 },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#0003', marginBottom: 6 },
    title:  { fontWeight: '600', fontSize: 16 },
});
