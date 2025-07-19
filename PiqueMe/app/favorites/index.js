import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
} from 'react-native';

import Header from '../components/Header';
import ParcFavoris from '../components/parcFavoris';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const API_URL = 'http://localhost:3000';

/**
 * Structure attendue par <ParcFavoris />
 * {
 *   id: string,
 *   name: string,
 *   imageUri: string,
 *   rating: number,
 *   reviews: number,
 *   distanceKm: number
 * }
 */

export default function FavoritesScreen() {
    /* -------- état utilisateur connecté -------- */
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
        });
        return unsub;
    }, []);

    /* -------- chargement des parcs (catalogue complet) -------- */
    const [parks, setParks] = useState([]);
    const [loadingParks, setLoadingParks] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_URL}/parks`);
                const data = await res.json();
                if (cancelled) return;

                // normalisation minimale → assure les champs requis par <ParcFavoris />
                const normed = data.map((p, i) => ({
                    id: String(p.id ?? p.NUM_INDEX ?? i),
                    name: p.name ?? p.Nom ?? 'Parc sans nom',
                    imageUri: p.imageUri ?? 'https://via.placeholder.com/400x200',
                    rating: Number(p.rating ?? 0),
                    reviews: Number(p.reviews ?? 0),
                    distanceKm: Number(p.distanceKm ?? 0),
                }));
                setParks(normed);
            } catch (e) {
                console.error('ERREUR fetch /parks', e);
            } finally {
                if (!cancelled) setLoadingParks(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    /* - chargement des favoris de l'utilisateur  */
    const [favMap, setFavMap] = useState({});   // { parkId: favId }
    const [loadingFavs, setLoadingFavs] = useState(true);

    const loadFavs = useCallback(async (uid) => {
        if (!uid) { setFavMap({}); setLoadingFavs(false); return; }
        setLoadingFavs(true);
        try {
            const res = await fetch(`${API_URL}/favorites/${uid}`);
            const favs = await res.json(); // [{id: favId, parkId: ...}, ...]
            const map = {};
            favs.forEach(f => { map[String(f.parkId)] = String(f.id); });
            setFavMap(map);
        } catch (e) {
            console.error('ERREUR fetch /favorites', e);
        } finally {
            setLoadingFavs(false);
        }
    }, []);

    /* recharge les favoris quand userId change */
    useEffect(() => { loadFavs(userId); }, [userId, loadFavs]);

    /* -- handler toggle -- */
    const handleToggleFavorite = useCallback(async (parkId, selected) => {
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
                setFavMap(m => ({ ...m, [parkId]: String(favId) }));
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
    }, [userId, favMap]);

    /* --liste des parcs favoris à afficher -- */
    const favoriteParks = useMemo(
        () => parks.filter(p => favMap[p.id]),
        [parks, favMap]
    );

    /* -- états de chargement combinés --*/
    const loading = loadingParks || loadingFavs;

    /* -------- rendu -------- */
    return (
        <SafeAreaView style={S.container}>
            {/* Header global (puisqu'on est hors tabs, il se placera sous le titre stack) */}
            <Header title="Parcs favoris" />

            {loading ? (
                <View style={S.loader}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={favoriteParks}
                    keyExtractor={(item, i) => `${item.id}-${i}`}
                    renderItem={({ item }) => (
                        <ParcFavoris
                            {...item}
                            initialFavorite={true}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={S.empty}>
                            <Text>Aucun parc favori.</Text>
                        </View>
                    }
                    contentContainerStyle={S.list}
                />
            )}
        </SafeAreaView>
    );
}

/* -- styles -- */
const S = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    loader:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list:      { paddingVertical: 8 },
    empty:     { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
});
