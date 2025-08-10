import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Text, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { getParkById } from '@/app/utils/firebaseUtils';


export type Spot = {
    idSpot: string;
    spotLabel: string;
}

export type Reservation = {
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

export default async function CompoReservation({reservation, onCancel, onConfirm}
                                         : CompoReservationProps) {

    const [parc, setParc] = useState<any>(null);
    //const [spot, setSpot] = useState(null);

    // Get les infos du parcs
    const getParc = await getParkById(reservation.idParc);
    if(getParc) setParc(getParc);

    const imgUrl = 'https://www.vecteezy.com/vector-art/4141669-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-vector-illustration'

    return (
        <Card style={styles.container}>
            {/* Image */}
            <View style={styles.row}>
                {/*<View style={styles.image}>*/}
                    <Card.Cover source={{ uri: imgUrl }} style={styles.image} />

                {/*</View>*/}

                {/* Infos */}
                <View style={styles.row}>
                    <Text style={styles.title}>{reservation.spot.spotLabel}</Text>
                    <Text> {parc.Nom}</Text>
                    <Text>Réservation du {reservation.dateDebut.toLocaleDateString('fr-CA')}
                        de {reservation.dateDebut.toLocaleTimeString('fr-CA')} à {reservation.dateFin.toLocaleTimeString('fr-CA')}.
                    </Text>

                    {reservation.etat === "en attente" ? (
                        <View style={styles.buttonRow}>
                            <IconButton icon="close" onPress={onCancel} />
                            <IconButton icon="check" onPress={onConfirm} />
                        </View>
                    ) : (
                        <View style={styles.buttonRow}>
                            <IconButton icon="pine-tree" onPress={() => console.log("Pique-me")} />
                        </View>
                    )}


                </View>
            </View>

        </Card>
    )
}

const styles = StyleSheet.create({
    container: {},
    image: {
        height:110,
        width:160,
        borderRadius:8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
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
})