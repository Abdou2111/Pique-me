import React, { useState, useEffect } from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import { Card, Text, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { getParkById } from '@/app/utils/firebaseUtils';



export type Spot = {
    idSpot: string;
    spotLabel: string;
}

export type Reservation = {
    id: string,
    confirmation2: boolean;
    createdAt: Date;
    dateDebut: Date;
    dateFin: Date;
    etat: string;
    idParc: string;
    spot: Spot;
    userId: string;
};

export interface CompoReservationProps {
    reservation: Reservation;
    onCancel: () => void;
    onConfirm: () => void;
}

export interface CompoReservationProps {
    reservation: Reservation
    onCancel: () => void
    onConfirm: () => void
}

export default function CompoReservation({ reservation, onCancel, onConfirm }: CompoReservationProps) {
    const [parc, setParc] = useState<any>(null)

    useEffect(() => {
        const fetchParc = async () => {
            const data = await getParkById(reservation.idParc)
            if (data) setParc(data)
        }
        fetchParc()
    }, [reservation.idParc])

    const imgUrl =
        'https://www.vecteezy.com/vector-art/4141669-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-vector-illustration'

    return (
        <Card style={styles.container}>
            <View style={styles.row}>
                <Card.Cover source={{ uri: imgUrl }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.title}>{reservation.spot.spotLabel}</Text>
                    <Text>Parc: {parc?.Nom ?? 'Chargement...'}</Text>
                    <Text>
                        Le {new Date(reservation.dateDebut).toLocaleDateString('fr-CA')} de{' '}
                        {new Date(reservation.dateDebut).toLocaleTimeString('fr-CA')} à{' '}
                        {new Date(reservation.dateFin).toLocaleTimeString('fr-CA')}.
                    </Text>

                    {reservation.etat === 'en attente' ? (
                        <View style={styles.buttonRow}>
                            <Pressable style={styles.action}>
                                <Text onPress={onCancel} style={{backgroundColor: "#f2594e", borderRadius: 5, padding: 3, fontSize:16,}}> Annuler</Text>
                            </Pressable>
                            <Pressable style={styles.action}>
                                <Text onPress={onConfirm} style={{backgroundColor: "#51ba4a", borderRadius: 5, padding: 3, fontSize:16,}}> Confirmer</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.buttonRow}>
                            <IconButton icon="pine-tree" onPress={() => console.log('Pique-me')} />
                        </View>
                    )}
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    image: {
        height:160,
        width:160,
        borderRadius:8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 12,
    },
    row: {
        flexDirection:'row',
        alignItems:'center',
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    info: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    action: {
        marginBottom: 10,
    }
})