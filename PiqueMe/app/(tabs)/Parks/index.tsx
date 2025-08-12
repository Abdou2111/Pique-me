// app/(tabs)/Parks/Home.tsx
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {
    View,
    SectionList,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native'
import * as Location from 'expo-location'
import ParcFavoris from '../../components/parcFavoris'
import useFavorites from '../../hooks/useFavorites'
import { subscribeParks, type Park } from '../../utils/firebaseUtils'
import Header from '../../components/Header' // ← logo + cœur Favoris
import {SafeAreaView} from "react-native-safe-area-context";

/* ---- tags: mapping identique à HOME ---- */
const toTag = (txt?: string | null): string | null => {
    const s = (txt ?? '').toLowerCase()
    if (s.includes('aire de jeu'))  return 'aireJeu'
    if (s.includes('récréatif'))    return 'recreatif'
    if (s.includes('plein air'))    return 'pleinAir'
    if (s.includes('pique-nique'))  return 'piqueNique'
    return null
}
const deriveTags = (p: Park): string[] => {
    const raw = (p.tags ?? []).map(t => (t ?? '').toLowerCase())
    const out = new Set<string>()
    if (raw.some(s => s.includes('aire de jeu')))  out.add('aireJeu')
    if (raw.some(s => s.includes('récréatif')))    out.add('recreatif')
    if (raw.some(s => s.includes('plein air')))    out.add('pleinAir')
    if (raw.some(s => s.includes('pique-nique')))  out.add('piqueNique')
    return [...out]
}
/* distance en mètres */
const distM = (la1:number, lo1:number, la2?:number, lo2?:number) => {
    if (la2 == null || lo2 == null) return Number.NaN
    const R = 6371e3
    const φ1 = la1 * Math.PI/180, φ2 = la2 * Math.PI/180
    const dφ = (la2 - la1) * Math.PI/180, dλ = (lo2 - lo1) * Math.PI/180
    const a = Math.sin(dφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function Center({ children }: { children: React.ReactNode }) {
    return <View style={S.center}><Text>{children}</Text></View>
}

const uniqueById = <T extends { id: string }>(list: T[]): T[] => {
    const seen = new Set<string>();
    return list.filter(p => !seen.has(p.id) && seen.add(p.id));
};

export default function ParksScreen() {
    const { ready } = useFavorites()
    const [parks, setParks] = useState<Park[]>([])
    const [loading, setLoading] = useState(true)
    const [coords, setCoords] = useState<{lat:number,lng:number} | null>(null)

    // Pour le refresh
    const [refreshing, setRefreshing] = useState(false)
    const unsubRef = useRef<null | (() => void)>(null)

    useEffect(() => {
        const unsub = subscribeParks((list) => {
            setParks(uniqueById(list));       // Parcs uniques par ID
            setLoading(false);
        });
        unsubRef.current = unsub
        return unsub;
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') return
                const loc = await Location.getCurrentPositionAsync({})
                setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude })
            } catch {}
        })()
    }, [])

    const onRefresh = async () => {
        try {
            setRefreshing(true)

            // Refresh location (no extra prompt)
            const perm = await Location.getForegroundPermissionsAsync()
            if (perm.status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({})
                setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude })
            }

            // Re-subscribe to force a fresh snapshot
            if (unsubRef.current) {
                unsubRef.current()
                unsubRef.current = null
            }
            const unsub = subscribeParks((list) => {
                setParks(uniqueById(list))
                setRefreshing(false)   // stop spinner when fresh data arrives
                setLoading(false)
            })
            unsubRef.current = unsub
        } catch {
            setRefreshing(false)
        }
    }

    // on lit les préférences depuis le contexte comme en Home
    const { userDoc } = require('../../context/UserDocContext').useUserDoc?.() ?? { userDoc: null }
    const prefs: string[] = Array.isArray(userDoc?.preferences)
        ? userDoc.preferences
        : (typeof userDoc?.preferences === 'string'
            ? userDoc.preferences.split(',').map((s:string)=>s.trim()).filter(Boolean)
            : [])

    const recommended = useMemo(() => {
        if (!parks.length) return [];

        let base: Park[];
        if (!prefs.length) {
            const arr = parks.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            base = arr;
        } else {
            const matched = parks.filter(p => {
                const tags = deriveTags(p);
                return prefs.every(t => tags.includes(t));
            });
            base = matched.length ? matched : parks;
        }
        return uniqueById(base).slice(0, 7);
    }, [parks, prefs]);

    const nearParks = useMemo(() => {
        if (!coords) return []
        const within = parks.filter(p => {
            const d = distM(coords.lat, coords.lng, p.lat, p.lng);
            return !Number.isNaN(d) && d <= 5000;
        });
        return uniqueById(within).slice(0, 7);
    }, [parks, coords])

    const sections = useMemo(() => ([
        { title: 'Parcs recommandés', data: recommended },
        { title: 'Parcs à proximité', data: nearParks  },
    ]), [recommended, nearParks])

    if (loading || !ready) return <Center><ActivityIndicator size="large" /></Center>

    return (
        <SafeAreaView style={S.ctn}>
            <Header />

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                style={S.list}
                contentContainerStyle={S.content}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderSectionHeader={({ section }) => (
                    <Text style={S.h2}>{section.title}</Text>
                )}
                renderItem={({ item }) => {
                    let distanceKm = 0
                    if (coords && item.lat != null && item.lng != null) {
                        const d = distM(coords.lat, coords.lng, item.lat, item.lng)
                        if (!Number.isNaN(d)) distanceKm = d / 1000
                    }
                    return (
                        <View style={S.rowCard}>
                            <ParcFavoris
                                id={item.id}
                                name={item.name}
                                imageUri={item.imageUri}
                                rating={0}
                                reviews={0}
                                distanceKm={distanceKm}
                            />
                        </View>
                    )
                }}
                ListEmptyComponent={<Center>Aucun parc.</Center>}
                SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
        </SafeAreaView>
    )
}

const S = StyleSheet.create({
    ctn: { flex: 1, backgroundColor: '#fff' },
    list: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    content: { paddingVertical: 8 },
    h2: {
        fontSize: 18, fontWeight: '700', color: '#0f6930',
        marginHorizontal: 12, marginTop: 8, marginBottom: 6,
    },
    rowCard: { alignItems: 'center' },
})
