/*  app/favorites/index.tsx
    ---------------------------------------------------------------
    Page  « Parcs favoris » 100 % Firestore v9, sans erreur TypeScript
    --------------------------------------------------------------- */

import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import {
    SafeAreaView, View, FlatList,
    ActivityIndicator, StyleSheet, Text,
} from 'react-native';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

import Header      from '../components/Header';
import ParcFavoris from '../components/parcFavoris';
import { useUserDoc } from '../context/UserDocContext';

/* ------------------------------- types ------------------------------- */
type Park = {
    id:   string;
    name: string;
    imageUri: string;
};

/* ------------------------------ page --------------------------------- */
export default function Favorites() {
    const { uid, userDoc } = useUserDoc();

    /* ------- catalogue des parcs -------- */
    const [parks, setParks]       = useState<Park[]>([]);
    const [loadingParks, setLoad] = useState(true);

    useEffect(() => {
        const ref = collection(db, 'parks');
        const unsub = onSnapshot(
            ref,
            (snap: QuerySnapshot<DocumentData>) => {
                setParks(
                    snap.docs.map(d => ({
                        id:   d.id,
                        name: (d.data().Nom as string) ?? 'Parc',
                        imageUri: 'https://via.placeholder.com/400x200',
                    }))
                );
                setLoad(false);
            }
        );
        return unsub;
    }, []);

    /* ------- id favoris -------- */
    const favIds = Array.isArray(userDoc?.favorites)
        ? (userDoc!.favorites as string[])
        : [];

    /* ------- toggle handler -------- */
    const toggleFav = useCallback(
        async (parkId: string, selected: boolean) => {
            if (!uid) return;
            const ref = doc(db, 'users', uid);
            await updateDoc(ref, {
                favorites: selected ? arrayUnion(parkId) : arrayRemove(parkId),
            });
        },
        [uid]
    );

    /* ------- filtrage -------- */
    const favoriteParks = useMemo(
        () => parks.filter(p => favIds.includes(p.id)),
        [parks, favIds]
    );

    /* -------------------------------------------------------------- */
    const loading = loadingParks || !userDoc;

    return (
        <SafeAreaView style={S.ctn}>
            <Header title="Parcs favoris" />

            {loading ? (
                <Center><ActivityIndicator size="large" /></Center>
            ) : (
                <FlatList
                    data={favoriteParks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ParcFavoris
                            {...item}
                            rating={0}
                            reviews={0}
                            distanceKm={0}
                            initialFavorite
                            onToggleFavorite={toggleFav}
                        />
                    )}
                    ListEmptyComponent={<Center>Aucun favori.</Center>}
                    contentContainerStyle={S.list}
                />
            )}
        </SafeAreaView>
    );
}

/* ------------------------------ helpers ------------------------------ */
function Center({ children }: { children: React.ReactNode }) {
    return <View style={S.center}><Text>{children}</Text></View>;
}

/* ------------------------------ styles ------------------------------- */
const S = StyleSheet.create({
    ctn:    { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    list:   { paddingVertical: 8 },
});
