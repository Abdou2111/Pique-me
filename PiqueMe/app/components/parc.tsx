// but: affichage d'un parc avec ses informations
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Text, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

interface ParcProps {
    id: string
    name: string
    imageUri: string
    latitude:  number
    longitude: number
    rating: number
    reviews: number
    distanceKm: number
    initialFavorite?: boolean
    onToggleFavorite?: (id: string, selected: boolean) => void
}

// Composant Parc
const Parc: React.FC<ParcProps> = ({
                                       id,
                                       name,
                                       imageUri,
                                       rating,
                                       reviews,
                                       distanceKm,
                                       initialFavorite = false,
                                       onToggleFavorite,
                                   }) => {
    const [favori, setFavori] = useState(initialFavorite)

    // Fonction pour gérer le toggle du favori
    const handleToggle = () => {
        const next = !favori
        setFavori(next)
        onToggleFavorite?.(id, next)
    }

    return (
        <Card style={styles.card}>
            <View style={styles.imageContainer}>
                <Card.Cover source={{ uri: imageUri }} style={styles.image} />
                <IconButton
                    icon={favori ? 'heart' : 'heart-outline'}
                    iconColor={favori ? 'red' : 'white'}
                    size={24}
                    style={styles.icon}
                    onPress={handleToggle}
                />
            </View>
            <View style={styles.content}>
                <Text variant="titleLarge">{name}</Text>
                <View style={styles.noteParc}>
                    <Icon name="star" size={20} color="#FFD700" style={styles.star} />
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                        {rating.toFixed(1)}
                    </Text>
                    <Text style={styles.text2}>({reviews})</Text>
                </View>
                <Text variant="bodyMedium" style={styles.distance}>
                    À {distanceKm.toFixed(1)} km
                </Text>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 180,
        margin: 8,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        height: 140,
        width: '100%',
    },
    icon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    content: {
        padding: 8,
    },
    noteParc: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    star: {
        marginRight: 4,
    },
    text2: {
        marginLeft: 4,
        color: 'gray',
    },
    distance: {
        color: 'gray',
        marginTop: 4,
    },
})

export default Parc
