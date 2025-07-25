/* app/(tabs)/Search.js */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    InteractionManager,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as geofire from 'geofire-common';
import * as Location from 'expo-location';

/* components */
import SearchBar from '../components/SearchBar';
import ParcList  from '../components/ParcList';

/* ─── Firebase ── */
import {
    collection,
    getDocs,
    query,
    orderBy,
    startAt,
    endAt,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/* ─── Tags disponibles ── */
const FILTERS = [
    { id: 'aireJeu',    label: 'Aire de jeu',  icon: 'game-controller' },
    { id: 'recreatif',  label: 'Récréatif',    icon: 'basketball'      },
    { id: 'pleinAir',   label: 'Plein air',    icon: 'leaf'            },
    { id: 'piqueNique', label: 'Pique-nique',  icon: 'restaurant'      },
];

/* mapping installation.TYPE → id de tag */
const toTag = t => {
    const s = (t ?? '').toLowerCase();
    if (s.includes('aire de jeu')) return 'aireJeu';
    if (s.includes('récréatif'))   return 'recreatif';
    if (s.includes('plein air'))   return 'pleinAir';
    if (s.includes('pique-nique')) return 'piqueNique';
    return null;
};

const norm = s =>
    s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

/* helper: convert Firestore doc → UI model */
const asPark = p => ({
    id:   p.NUM_INDEX,
    name: p.Nom,
    lat:  p.centroid?.lat,
    lng:  p.centroid?.lng,
    tags: (p.installations ?? [])
        .map(i => toTag(i.TYPE))
        .filter(Boolean),
    filters: (p.installations ?? [])
        .map(i => toTag(i.TYPE))
        .filter(Boolean),
});

/* tiny utility – returns parks whose geohash falls in `region` */
async function fetchParksInRegion(region) {
    const center  = [region.latitude, region.longitude];
    const radiusM = Math.max(region.latitudeDelta, region.longitudeDelta) * 55_000; // ≈ m/deg

    const bounds   = geofire.geohashQueryBounds(center, radiusM);
    const promises = bounds.map(([start, end]) =>
        getDocs(
            query(
                collection(db, 'parks'),
                orderBy('geohash'),
                startAt(start),
                endAt(end),
            ),
        ),
    );

    const snaps = await Promise.all(promises);
    return snaps.flatMap(s => s.docs.map(d => asPark(d.data())));
}

/* merge two arrays of parks without duplicates (by id) */
const mergeById = (oldArr, newArr) => {
    const map = new Map(oldArr.map(p => [p.id, p]));
    newArr.forEach(p => map.set(p.id, p));
    return [...map.values()];
};

/* km → degrees latitude (≈ 111 km ≙ 1 ° lat) */
const km2degLat  = km => km / 111;
/* adjust long delta by cos φ so window looks square */
const km2degLng  = (km, lat) => km / (111 * Math.cos(lat * Math.PI / 180));

/* ──────────────────────────────────────────────────────────────── */
export default function Search() {
    const insets = useSafeAreaInsets();
    /* UI state */
    const [query,  setQuery]  = useState('');
    const [active, setActive] = useState(new Set());
    const [region, setRegion] = useState(null);

    /* data state */
    const [parks, setParks] = useState([]);

    /* ask for location once on mount */
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') throw new Error('permission denied');

                const { coords } = await Location.getCurrentPositionAsync({});
                const latDelta = km2degLat(1);                   // ~1 km radius
                const lngDelta = km2degLng(1, coords.latitude);
                setRegion({
                    latitude:       coords.latitude,
                    longitude:      coords.longitude,
                    latitudeDelta:  latDelta,
                    longitudeDelta: lngDelta,
                });
            } catch (e) {
                console.warn('Location error, falling back to Montréal:', e);
                const latDelta = km2degLat(2);                   // 2 km radius
                setRegion({
                    latitude:       45.5019,
                    longitude:     -73.5674,
                    latitudeDelta:  latDelta,
                    longitudeDelta: latDelta,
                });
            }
        })();
    }, []);

    /* staged fetch: viewport first, full dump after first frame */
    useEffect(() => {
        if (!region) return; // wait for initial region
        const load = async () => {
            /* 1 quick viewport query */
            const initial = await fetchParksInRegion(region);
            setParks(initial);

            /* 2 heavy full-collection fetch in the background */
            InteractionManager.runAfterInteractions(async () => {
                const snapshot = await getDocs(collection(db, 'parks'));
                const allParks = snapshot.docs.map(d => asPark(d.data()));
                setParks(prev => mergeById(prev, allParks));
            });
        };
        load();
    }, [region]);

    /* helper – is a park inside current viewport? */
    const inside = useCallback((p, r) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = r;
        const halfLat = latitudeDelta / 2;
        const halfLng = longitudeDelta / 2;
        return (
            p.lat >= latitude  - halfLat &&
            p.lat <= latitude  + halfLat &&
            p.lng >= longitude - halfLng &&
            p.lng <= longitude + halfLng
        );
    }, []);

    /* filtered list for markers + bottom sheet */
    const shown = useMemo(
        () =>
            parks.filter(
                p =>
                    inside(p, region) &&
                    (!query || norm(p.name).includes(norm(query))) &&
                    (![...active].length || [...active].every(t => p.tags.includes(t))),
            ),
        [parks, region, query, active, inside],
    );

    const toggle = id => {
        const n = new Set(active);
        n.has(id) ? n.delete(id) : n.add(id);
        setActive(n);
    };

    /* ────────────────────────── UI ────────────────────────── */
    return (
        <SafeAreaView style={S.flex} >
            {/* render map only when we have a region */}
            {region && (
                <MapView
                    style={S.map}
                    initialRegion={region}
                    onRegionChangeComplete={setRegion}
                    showsUserLocation            // blue dot
                    showsMyLocationButton        // Pour android
                    followsUserLocation={false}  // set true if you want the map to keep centring
                >
                    {shown.map(p => (
                        <Marker
                            key={p.id}
                            coordinate={{ latitude: p.lat, longitude: p.lng }}
                            title={p.name}
                        />
                    ))}
                </MapView>
            )}

            {/* ── Barre recherche + filtres ── */}
            <View style={[S.topOverlay, { top: insets.top + 8 }]}>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Rechercher des parcs…"
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={S.tagRow}
                >
                    {FILTERS.map(t => {
                        const on = active.has(t.id);
                        return (
                            <Pressable
                                key={t.id}
                                onPress={() => toggle(t.id)}
                                style={[S.chip, on && S.chipOn]}
                            >
                                <Ionicons
                                    name={on ? t.icon : `${t.icon}-outline`}
                                    size={16}
                                    color={on ? '#fff' : '#444'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[S.txt, on && S.txtOn]}>{t.label}</Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ── Liste scrollable en bas ── */}
            <View style={S.listPanel}>
                <View style={S.header}>
                    <View style={S.handle} />
                    <Text style={S.title}>{shown.length} Résultats</Text>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <ParcList
                        parks={shown}
                        filterQuery={norm(query)}
                        filterTags={[...active]}
                        useFavorisCard
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

/* ── styles ── */
const S = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#fff' },
    map:  StyleSheet.absoluteFillObject,

    topOverlay: { position: 'absolute', top: 10, width: '100%', paddingHorizontal: 12 },
    tagRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

    chip:   {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 22,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipOn: { backgroundColor: '#0f6930' },

    txt:   { fontSize: 12, color: '#444' },
    txtOn: { color: '#fff', fontWeight: '600' },

    listPanel: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 320,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        paddingHorizontal: 12,
        paddingTop: 8,
    },

    header: { alignItems: 'center', paddingTop: 6 },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#0003', marginBottom: 6 },
    title:  { fontWeight: '600', fontSize: 16 },
});
