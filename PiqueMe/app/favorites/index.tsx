import React, { useEffect, useMemo, useState } from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/app/components/Header'
import ParcFavoris from '@/app/components/parcFavoris'
import { subscribeParks, type Park } from '@/app/utils/firebaseUtils'
import useFavorites from '@/app/hooks/useFavorites'

const BG = '#F6F6F2'
const GREEN = '#0f6930'

function Center({ children }: { children: React.ReactNode }) {
    return (
        <View style={S.center}>
            {typeof children === 'string' ? <Text style={S.emptyTxt}>{children}</Text> : children}
        </View>
    )
}

export default function FavoritesScreen() {
    const insets = useSafeAreaInsets()
    const { favIds, ready } = useFavorites()
    const [parks, setParks] = useState<Park[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = subscribeParks((list) => { setParks(list); setLoading(false) })
        return unsub
    }, [])

    // ↓ Une seule déclaration + déduplication par id
    const favoriteParks = useMemo(() => {
        const seen = new Set<string>()
        return parks
            .filter(p => favIds.includes(p.id))
            .filter(p => {
                if (seen.has(p.id)) return false
                seen.add(p.id)
                return true
            })
    }, [parks, favIds])

    if (loading || !ready) {
        return (
            <SafeAreaView style={S.screen} edges={['top', 'left', 'right']}>
                <Header />
                <Center><ActivityIndicator size="large" /></Center>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={S.screen} edges={['top', 'left', 'right']}>
            <Header />
            <View style={S.page}>
                <Text style={S.title}>Parcs favoris</Text>

                // 2) Clés vraiment uniques pour FlatList
                <FlatList
                    data={favoriteParks}
                    keyExtractor={(it, idx) => `${String(it.id)}-${idx}`}  // <= plus de collisions
                    contentContainerStyle={[S.list, { paddingBottom: 8 + insets.bottom }]}
                    renderItem={({ item }) => <ParcFavoris {...item} />}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    ListEmptyComponent={<Center>Aucun favori.</Center>}
                />

            </View>
        </SafeAreaView>
    )
}

const S = StyleSheet.create({
    screen: { flex: 1, backgroundColor: BG },
    page:   { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
    title:  { fontSize: 22, fontWeight: '800', color: GREEN, marginVertical: 8 },
    list:   { paddingHorizontal: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    emptyTxt: { color: '#666' },
})
