import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import HeartButton from './HeartButton'
import { router } from 'expo-router'
import useFavorites from '@/app/hooks/useFavorites'

type Props = {
    id: string; name: string; imageUri: string
    rating?: number; reviews?: number; distanceKm?: number
    initialFavorite?: boolean
    isFavorite?: boolean
    onToggleFavorite?: (id: string, selected: boolean) => void
}

export default function ParcFavoris({
                                        id, name, imageUri, rating = 0, reviews = 0, distanceKm = 0,
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

    return (
        <Card style={S.card} onPress={() => router.push({ pathname: '/Parks/Park/PageParc', params: { id, isFavorite: String(fav) } })}>
            <View style={S.row}>
                <View style={S.imgWrap}>
                    <Card.Cover source={{ uri: imageUri }} style={S.img} />
                    <HeartButton isFavorite={fav} onToggle={toggle} />
                </View>
                <View style={S.info}>
                    <Text variant="titleMedium" numberOfLines={2} style={S.title}>{name}</Text>
                    <View style={S.note}>
                        <Icon name="star" size={18} color="#FFD700" style={{ marginRight: 4 }} />
                        <Text variant="bodyMedium" style={S.bold}>{Number(rating).toFixed(1)}</Text>
                        <Text style={S.grey}>({reviews})</Text>
                    </View>
                    <Text variant="bodyMedium" style={S.grey}>À {Number(distanceKm).toFixed(1)} km</Text>
                </View>
            </View>
        </Card>
    )
}

const CARD_HEIGHT = 130

const S = StyleSheet.create({
    card: {
        width: '90%',
        height: CARD_HEIGHT,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    imgWrap: {
        position: 'relative',
        height: '100%',
        width: 160,
        overflow: 'hidden',
    },
    img: {
        height: '100%',
        width: '100%',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    info: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
        marginVertical: 10,
    },
    title: {
        color: 'green',
        fontSize: 18,
        fontWeight: '600',
    },
    note: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    bold: {
        fontWeight: 'bold',
    },
    grey: {
        marginLeft: 8,
        color: 'grey',
    },
})
