import React, { useEffect, useState } from 'react'
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native'
import {useLocalSearchParams, useNavigation, useRouter} from 'expo-router'
import CompoReservation, {Reservation} from '../../../components/CompoReservation'
import {Ionicons} from "@expo/vector-icons";

export default function AllReservation() {
    const router = useRouter();
    const { reservations } = useLocalSearchParams()
    const [parsedReservations, setParsedReservations] = useState<Reservation[]>([])

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false, title: '' });
    }, [navigation]);

    useEffect(() => {
        if (reservations) {
            try {
                const parsed = JSON.parse(reservations as string)
                setParsedReservations(parsed)
            } catch (error) {
                console.error('Erreur de parsing des réservations :', error)
                setParsedReservations([])
            }
        }
    }, [reservations])

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/Profile')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Toutes les réservations</Text>
            </View>


            {parsedReservations.length === 0 ? (
                <Text style={styles.empty}>Aucune réservation à afficher.</Text>
            ) : (
                <FlatList
                    data={parsedReservations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CompoReservation
                            reservation={item}
                            onCancel={() => console.log('Annulation')}
                            onConfirm={() => console.log('Confirmation')}
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        marginLeft: 12,
        marginTop: 10,

    },
    empty: {
        fontSize: 16,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#eee' },

})
