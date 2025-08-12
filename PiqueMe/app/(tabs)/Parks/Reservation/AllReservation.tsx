import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'
import CompoReservation, { Reservation } from '../../../components/CompoReservation'
import { Ionicons } from '@expo/vector-icons'

type AllReservationProps = {
    reservations: Reservation[]
    onCancel: (id: string) => void
    onClose: () => void
}

const screenHeight = Dimensions.get('window').height

export default function AllReservation({ reservations, onCancel, onClose }: AllReservationProps) {
    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop}>
                <TouchableWithoutFeedback>
                    <View style={styles.overlay}>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.title}>Toutes les réservations</Text>
                            </View>

                            {!Array.isArray(reservations) || reservations.length === 0 ? (
                                <Text style={styles.empty}>Aucune réservation à afficher.</Text>
                            ) : (
                                <FlatList
                                    data={reservations}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <CompoReservation
                                            reservation={item}
                                            onCancel={() => onCancel(item.id)}
                                            onConfirm={() => console.log('Confirmation')}
                                        />
                                    )}
                                    contentContainerStyle={styles.list}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    )


}

const styles = StyleSheet.create({
    overlay: { position: 'absolute',
        top: screenHeight * 0.4,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },

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
        borderColor: '#eee',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // voile sombre et transparent
        justifyContent: 'flex-end', // pousse l’overlay vers le bas
    },

})
