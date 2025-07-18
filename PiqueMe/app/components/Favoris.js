// app/components/Favoris.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Parc from './parc'; // ou ./parcFavoris si tu préfères
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const API_URL = 'http://localhost:3000'; // IP LAN si device

export default function Favoris({ parks }) {
    const [userId, setUserId] = useState(null);
    const [favMap, setFavMap] = useState({});
    const [loadingFavs, setLoadingFavs] = useState(true);

    // 1. user connecté ?
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setFavMap({});
            }
        });
        return unsubscribe;
    }, []);

    // 2. charger favoris user
    useEffect(() => {
        if (!userId) return;
        setLoadingFavs(true);
        fetch(`${API_URL}/favorites/${userId}`)
            .then(res => res.json())
            .then(favs => {
                const map = {};
                favs.forEach(f => {
                    map[f.parkId] = f.id;
                });
                setFavMap(map);
            })
            .catch(console.error)
            .finally(() => setLoadingFavs(false));
    }, [userId]);

    // 3. handler toggle
    const onToggleFavorite = async (parkId, selected) => {
        if (!userId) return; // pas connecté

        if (selected) {
            // add
            try {
                const res = await fetch(`${API_URL}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, parkId }),
                });
                const { id: favId } = await res.json();
                setFavMap(m => ({ ...m, [parkId]: favId }));
            } catch (e) {
                console.error('Ajout favori échoué', e);
            }
        } else {
            // remove
            const favId = favMap[parkId];
            if (!favId) return;
            try {
                await fetch(`${API_URL}/favorites/${favId}`, { method: 'DELETE' });
                setFavMap(m => {
                    const copy = { ...m };
                    delete copy[parkId];
                    return copy;
                });
            } catch (e) {
                console.error('Suppression favori échouée', e);
            }
        }
    };

    // 4. loader
    if (!userId || loadingFavs) {
        return (
            <View style={S.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // 5. filtrer
    const favoriteParks = parks.filter(p => favMap[p.id]);

    return (
        <FlatList
            data={favoriteParks}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            renderItem={({ item }) => (
                <Parc
                    {...item}
                    initialFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                />
            )}
            contentContainerStyle={S.list}
            ListEmptyComponent={
                <View style={S.empty}>
                    <Text>Aucun parc favori trouvé</Text>
                </View>
            }
        />
    );
}

const S = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 8 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
