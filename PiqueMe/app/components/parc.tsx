// app/components/Parc.js
import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Text, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

export interface ParcProps {
    id: string
    name: string
    imageUri: string
    rating: number
    reviews: number
    distanceKm: number
    initialFavorite?: boolean
    onToggleFavorite?: (id: string, selected: boolean) => void
}

export default function Parc({
                                 id, name, imageUri, rating, reviews, distanceKm,
                                 initialFavorite = false,
                                 onToggleFavorite,
                             }: ParcProps) {
    const [fav, setFav] = useState(initialFavorite)
    useEffect(() => { setFav(initialFavorite) }, [initialFavorite])

    const toggle = () => {
        const next = !fav
        setFav(next)
        onToggleFavorite?.(id, next)
    }

    return (
        <Card style={S.card}>
            <View style={S.imgWrap}>
                <Card.Cover source={{ uri: imageUri }} style={S.img} />
                <IconButton
                    icon={fav ? 'heart' : 'heart-outline'}
                    iconColor={fav ? 'red' : 'white'}
                    size={24}
                    style={S.heart}
                    onPress={toggle}
                />
            </View>
            <View style={S.info}>
                <Text variant="titleLarge">{name}</Text>
                <View style={S.note}>
                    <Icon name="star" size={20} color="#FFD700" style={{ marginRight: 4 }} />
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{rating.toFixed(1)}</Text>
                    <Text style={S.grey}>({reviews})</Text>
                </View>
                <Text variant="bodyMedium" style={S.grey}>À {distanceKm.toFixed(1)} km</Text>
            </View>
        </Card>
    )
}

const S = StyleSheet.create({
    card:{ width:180, margin:8 },
    imgWrap:{ position:'relative' },
    img:{ height:140, width:'100%' },
    heart:{ position:'absolute', top:8, right:8, backgroundColor:'rgba(0,0,0,0.4)', borderRadius:20 },
    info:{ padding:8 },
    note:{ flexDirection:'row', alignItems:'center', marginTop:4 },
    grey:{ marginLeft:4, color:'gray' },
})
