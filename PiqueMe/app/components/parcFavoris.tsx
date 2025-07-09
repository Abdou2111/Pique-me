// composant utilisee lors de la recherche d'un parc

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, Icon } from 'react-native-paper';

export interface ParcFavorisProps {
    id: string;
    name: string;
    imageUri: string;
    rating: number;
    reviews: number;
    latitude:  number
    longitude: number
    distanceKm: number;
    initialFavorite?: boolean;
    onToggleFavorite?: (id: string, fav: boolean) => void;
}

export default function ParcFavoris({
                                        id,
                                        name,
                                        imageUri,
                                        rating,
                                        reviews,
                                        distanceKm,
                                        initialFavorite = false,
                                        onToggleFavorite,
                                    }: ParcFavorisProps) {
    const [fav, setFav] = useState(initialFavorite);
    const toggle = () => {
        const next = !fav;
        setFav(next);
        onToggleFavorite?.(id, next);
    };

    return (
        <Card style={styles.card}>
            <View style={styles.row}>
                {/* image + cœur */}
                <View style={styles.imgWrap}>
                    <Card.Cover source={{ uri: imageUri }} style={styles.img} />
                    <IconButton
                        icon={fav ? 'heart' : 'heart-outline'}
                        iconColor={fav ? 'red' : 'white'}
                        size={24}
                        style={styles.heart}
                        onPress={toggle}
                    />
                </View>

                {/* infos */}
                <View style={styles.info}>
                    <Text variant="titleLarge" style={styles.title}>{name}</Text>

                    <View style={styles.note}>
                        <Icon source="star" color="#FFD700" size={20} />
                        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                            {rating.toFixed(1)}
                        </Text>
                        <Text style={styles.grey}>({reviews} reviews)</Text>
                    </View>

                    <Text variant="bodyMedium" style={styles.grey}>À {distanceKm.toFixed(1)} km</Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: { width: '90%', backgroundColor: '#fff', margin: 16 },
    row: { flexDirection: 'row', alignItems: 'center' },
    imgWrap: { position: 'relative' },
    img: { height: 110, width: 160, borderRadius: 8 },
    heart: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
    },
    info: { flex: 1, paddingLeft: 12, justifyContent: 'center', margin: 10 },
    title: { color: 'green' },
    note: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    grey: { marginLeft: 8, color: 'grey' },
});
