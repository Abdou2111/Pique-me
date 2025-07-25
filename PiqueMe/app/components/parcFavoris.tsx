// app/components/parcFavoris.js
import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text, Icon } from 'react-native-paper'
import { router } from 'expo-router'

export interface ParcFavorisProps {
    id: string
    name: string
    imageUri: string
    rating: number
    reviews: number
    distanceKm: number
    initialFavorite?: boolean
    onToggleFavorite?: (id: string, selected: boolean) => void
}

export default function ParcFavoris({
                                        id, name, imageUri, rating, reviews, distanceKm,
                                        initialFavorite = false,
                                        onToggleFavorite,
                                    }: ParcFavorisProps) {
    const [fav, setFav] = useState(initialFavorite)
    useEffect(() => { setFav(initialFavorite) }, [initialFavorite])

    const toggle = () => {
        const next = !fav
        setFav(next)
        onToggleFavorite?.(id, next)
    }

    const handlePress = () => {
        // Utilise la dernière valeur de fav avant navigation
        const isFav = initialFavorite || fav;

        router.push({
            pathname: '/Parks/Park/PageParc',
            params: {
                id,
                isFavorite: isFav.toString(),
            },
        });
    };

    return (
        <Card style={S.card} onPress={handlePress}>
            <View style={S.row}>
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
                    <Text variant="titleLarge" style={S.title}>{name}</Text>
                    <View style={S.note}>
                        <Icon source="star" color="#FFD700" size={20} />
                        <Text variant="bodyMedium" style={{ fontWeight:'bold' }}>{rating.toFixed(1)}</Text>
                        <Text style={S.grey}>({reviews} reviews)</Text>
                    </View>
                    <Text variant="bodyMedium" style={S.grey}>À {distanceKm.toFixed(1)} km</Text>
                </View>
            </View>
        </Card>
    )
}

const S = StyleSheet.create({
    card:{ width:'90%', backgroundColor:'#fff', margin:16 },
    row:{ flexDirection:'row', alignItems:'center' },
    imgWrap:{ position:'relative' },
    img:{ height:110, width:160, borderRadius:8 },
    heart:{ position:'absolute', top:8, right:8, backgroundColor:'rgba(0,0,0,0.4)', borderRadius:30 },
    info:{ flex:1, paddingLeft:12, justifyContent:'center', margin:10 },
    title:{ color:'green' },
    note:{ flexDirection:'row', alignItems:'center', paddingVertical:4 },
    grey:{ marginLeft:8, color:'grey' },
})
