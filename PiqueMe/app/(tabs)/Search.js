/* app/(tabs)/Search.js */

import React, { useState, useEffect, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import SearchBar  from '../components/SearchBar';
import ParcList   from '../components/ParcList';

/* ─── Firebase ── */
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/* ─── Tags disponibles ── */
const FILTERS = [
    { id:'aireJeu',   label:'Aire de jeu',     icon:'game-controller' },
    { id:'recreatif', label:'Récréatif',       icon:'basketball'      },
    { id:'pleinAir',  label:'Plein air',       icon:'leaf'            },
    { id:'piqueNique',label:'Pique‑nique',     icon:'restaurant'      },
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

const norm = s => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();

/* ──────────────────────────────────────────────────── */
export default function Search() {
    /* UI state */
    const [query,  setQuery]  = useState('');
    const [active, setActive] = useState(new Set());

    /* data state */
    const [parks, setParks] = useState([]);   // tous les parcs Firestore

    /* 1. lecture Firestore une seule fois */
    useEffect(() => {
        (async () => {
            try {
                const snap = await getDocs(collection(db, 'parks'));
                const list = snap.docs.map(d => {
                    const p = d.data();
                    return {
                        id:   p.NUM_INDEX,
                        name: p.Nom,
                        lat:  p.centroid?.lat,
                        lng:  p.centroid?.lng,
                        tags: (p.installations ?? [])
                            .map(i => toTag(i.TYPE))
                            .filter(Boolean),
                    };
                });
                setParks(list);
            } catch (e) { console.error(e); }
        })();
    }, []);

    /* 2. filtrage commun carte + liste */
    const shown = useMemo(() => parks.filter(p =>
        (!query || norm(p.name).includes(norm(query))) &&
        (![...active].length || [...active].every(t => p.tags.includes(t)))
    ), [parks, query, active]);

    /* initial région Montréal */
    const region = {
        latitude: 45.5019,
        longitude: -73.5674,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
    };

    const toggle = id => {
        const n = new Set(active);
        n.has(id) ? n.delete(id) : n.add(id);
        setActive(n);
    };

    return (
        <SafeAreaView style={S.flex}>
            {/* ── Carte + marqueurs ─── */}
            <MapView style={S.map} initialRegion={region}>
                {shown.map((p, idx) => (
                    <Marker
                        key={`${p.id}-${idx}`}
                        coordinate={{ latitude: p.lat, longitude: p.lng }}
                        title={p.name}
                    />
                ))}

            </MapView>

            {/* ── Barre recherche + filtres ─── */}
            <View style={S.topOverlay}>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Rechercher des parcs…"
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.tagRow}>
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
                    <Text style={S.title}>{shown.length} Résultats</Text>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    {/* ParcList refiltrera pareil — c’est ok */}
                    <ParcList
                        filterQuery={norm(query)}
                        filterTags={[...active]}
                        useFavorisCard
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

/* ── styles ──── */
const S = StyleSheet.create({
    flex:{ flex:1, backgroundColor:'#fff' },
    map: StyleSheet.absoluteFillObject,

    topOverlay:{ position:'absolute', top:10, width:'100%', paddingHorizontal:12 },
    tagRow:{ flexDirection:'row', alignItems:'center', marginTop:8 },

    chip:{ flexDirection:'row', alignItems:'center',
        backgroundColor:'#f0f0f0', borderRadius:22,
        paddingHorizontal:12, paddingVertical:6, marginRight:8 },
    chipOn:{ backgroundColor:'#0f6930' },

    txt:{ fontSize:12, color:'#444' },
    txtOn:{ color:'#fff', fontWeight:'600' },

    listPanel:{ position:'absolute', bottom:0, width:'100%', height:320,
        backgroundColor:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16,
        shadowColor:'#000', shadowOpacity:0.1, shadowRadius:6, elevation:6,
        paddingHorizontal:12, paddingTop:8 },

    header:{ alignItems:'center', paddingTop:6 },
    handle:{ width:40, height:4, borderRadius:2, backgroundColor:'#0003', marginBottom:6 },
    title:{ fontWeight:'600', fontSize:16 },
});
