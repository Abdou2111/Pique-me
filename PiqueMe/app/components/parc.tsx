import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { router } from 'expo-router'
import HeartButton from './HeartButton'
import useFavorites from '@/app/hooks/useFavorites'

type Props = {
    id: string
    name: string
    imageUri: string
    rating?: number
    reviews?: number
    distanceKm?: number
    /** compat */
    initialFavorite?: boolean
    isFavorite?: boolean
    onToggleFavorite?: (id: string, selected: boolean) => void
}

const CARD_WIDTH  = 180
const CARD_HEIGHT = 240
const IMG_HEIGHT  = 130

export default function Parc({
                                 id, name, imageUri,
                                 rating = 0, reviews = 0, distanceKm = 0,
                                 initialFavorite, isFavorite, onToggleFavorite,
                             }: Props) {
    const { isFavorite: isFavHook, setFavorite } = useFavorites()
    const favFromHook = isFavHook(id)
    const fav = typeof isFavorite === 'boolean'
        ? isFavorite
        : (typeof initialFavorite === 'boolean' ? initialFavorite : favFromHook)

    const toggle = () => {
        const next = !fav
        onToggleFavorite?.(id, next)
        setFavorite(id, next)
    }

    const openDetails = () => {
        router.push({ pathname: '/Parks/Park/PageParc', params: { id, isFavorite: String(fav) } })
    }

    return (
        <Card style={S.card} onPress={openDetails}>
            {/* Image + cœur overlay */}
            <View style={S.imgWrap}>
                <Card.Cover source={{ uri: imageUri }} style={S.img} />
                <HeartButton isFavorite={fav} onToggle={toggle} />
            </View>

            {/* Corps fixe: toujours même hauteur, rien ne disparaît */}
            <View style={S.body}>
                {/* Nom */}
                <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="tail" style={S.title}>
                    {name || 'Parc'}
                </Text>

                {/* Note + (reviews) */}
                <View style={S.row}>
                    <Icon name="star" size={18} color="#FFD700" style={{ marginRight: 4 }} />
                    <Text variant="bodyMedium" style={S.bold}>
                        {Number(rating).toFixed(1)}
                    </Text>
                    <Text style={S.muted}> ({Number(reviews)})</Text>
                </View>

                {/* Distance */}
                <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="tail" style={S.muted}>
                    À {Number(distanceKm).toFixed(1)} km
                </Text>
            </View>
        </Card>
    )
}

const S = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',              // rien ne déborde
        backgroundColor: '#fff',
    },
    imgWrap: {
        position: 'relative',
        width: '100%',
        height: IMG_HEIGHT,
    },
    img: {
        width: '100%',
        height: IMG_HEIGHT,
    },
    body: {
        // Hauteur fixe = total - image
        height: CARD_HEIGHT - IMG_HEIGHT,
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'space-between', // répartit proprement les 3 blocs
    },
    title: { fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center' },
    bold: { fontWeight: 'bold' },
    muted: { color: 'gray' },
})
