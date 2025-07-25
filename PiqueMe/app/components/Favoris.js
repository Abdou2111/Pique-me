/*  Liste des parcs mis en favori
    ─────────────────────────────
    • Lit `uid`, `userDoc.favorites` et `toggleFav` via le contexte.
    • Affiche les cartes <ParcFavoris /> que tu as déjà.
    • AUCUN changement côté <Parc /> ou <ParcFavoris /> sauf un détail
      de synchro expliqué plus bas.                                          */

import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView, View, ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native'
import Header        from '../components/Header'
import ParcFavoris   from '../components/parcFavoris'      // ton composant existant
import { useUserDoc } from '../context/UserDocContext'

const API_URL = 'http://localhost:3000'     // 👉  catalogue complet (inchangé)

export default function FavoritesScreen() {
    const { uid, userDoc, toggleFav } = useUserDoc()

    /* ---- 1) charger le catalogue des parcs -------------------------------- */
    const [parks, setParks] = useState([])
    const [loadingParks, setLoadingParks] = useState(true)

    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                const res  = await fetch(`${API_URL}/parks`)
                const data = await res.json()
                if (!cancel) setParks(data)
            } catch (e) {
                console.error('fetch /parks', e)
            } finally {
                if (!cancel) setLoadingParks(false)
            }
        })()
        return () => { cancel = true }
    }, [])

    /* ---- 2) filtrer ceux présents dans userDoc.favorites ------------------ */
    const favSet = new Set(userDoc?.favorites ?? [])
    const favoriteParks = useMemo(
        () => parks.filter(p => favSet.has(String(p.NUM_INDEX ?? p.id))),
        [parks, favSet]
    )

    /* ---- 3) états de chargement ------------------------------------------ */
    if (!uid)                      return <Centered>Non connecté.</Centered>
    if (!userDoc || loadingParks)  return <Centered><ActivityIndicator size="large" /></Centered>

    /* ---- 4) toggle cœur --------------------------------------------------- */
    const onToggle = (parkId, selected) =>
        toggleFav(String(parkId), selected)

    /* ---- 5) rendu --------------------------------------------------------- */
    return (
        <SafeAreaView style={S.root}>
            <Header title="Parcs favoris" />
            <FlatList
                data={favoriteParks}
                keyExtractor={(item,i)=>`${item.id ?? item.NUM_INDEX}-${i}`}
                renderItem={({item})=>(
                    <ParcFavoris
                        {...item}
                        initialFavorite={true}
                        onToggleFavorite={onToggle}
                    />
                )}
                contentContainerStyle={S.list}
                ListEmptyComponent={<Centered>Aucun parc favori.</Centered>}
            />
        </SafeAreaView>
    )
}

/* ---- petites aides visu ------------------------------------------------- */
function Centered({ children }) {
    return <View style={S.center}><Text>{children}</Text></View>
}

/* ---- styles ------------------------------------------------------------- */
const S = StyleSheet.create({
    root:   { flex:1, backgroundColor:'#fff' },
    center: { flex:1, justifyContent:'center', alignItems:'center', padding:32 },
    list:   { paddingVertical:8 },
})
