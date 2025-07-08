import React, { useEffect, useMemo, useState } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    ScrollView,
    Pressable,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import ParcFavoris from '../components/parcFavoris';   // ← composant carte favori

/*  1.  filtres  */
const FILTERS = [
    { id: 'bbq',   label: 'BBQ' },
    { id: 'sport', label: 'Sport' },
    { id: 'dog',   label: 'Chiens' },
];

/* 2.  dataset Ville de Montréal  */
const URL =
    'https://donnees.montreal.ca/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/' +
    'resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json';

export default function Search() {
    const [loading, setLoading] = useState(true);
    const [parks, setParks]   = useState([]);
    const [query, setQuery]   = useState('');
    const [active, setActive] = useState(new Set());

    /* 3.  chargement des parcs  */
    useEffect(() => {
        (async () => {
            try {
                const json = await (await fetch(URL)).json();
                const data = json.features
                    .filter(f => f.properties.Type?.toLowerCase() === 'parc')
                    .map(f => ({
                        id: f.properties.NUM_INDEX,
                        name: [f.properties.Type, f.properties.Lien, f.properties.Nom]
                            .filter(Boolean).join(' '),
                        imageUri: 'https://via.placeholder.com/400x200',
                        rating: 0,
                        reviews: 0,
                        distanceKm: 0,
                        /* TODO : remplir avec les vrais attributs quand dispo */
                        filters: ['bbq', 'sport'],
                    }));
                setParks(data);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        })();
    }, []);

    /* 4.  filtrage par texte + pins sélectionnés  */
    const shown = useMemo(
        () =>
            parks.filter(p =>
                (!query || p.name.toLowerCase().includes(query.toLowerCase())) &&
                (![...active].length || [...active].every(f => p.filters.includes(f))),
            ),
        [parks, query, active],
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    /*  5.  UI  */
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* barre recherche */}
            <View style={styles.box}>
                <TextInput
                    placeholder="Rechercher des parcs…"
                    value={query}
                    onChangeText={setQuery}
                    style={{ flex: 1 }}
                />
            </View>

            {/* filtres horizontaux */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
                {FILTERS.map(f => {
                    const sel = active.has(f.id);
                    return (
                        <Pressable
                            key={f.id}
                            onPress={() => {
                                const n = new Set(active);
                                sel ? n.delete(f.id) : n.add(f.id);
                                setActive(n);
                            }}
                            style={[styles.chip, sel && styles.on]}
                        >
                            <Text style={[styles.lbl, sel && styles.lblOn]}>{f.label}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* liste résultats */}
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={styles.hd}>{shown.length} résultats</Text>

                {shown.map(p => (
                    <ParcFavoris
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        imageUri={p.imageUri}
                        rating={p.rating}
                        reviews={p.reviews}
                        distanceKm={p.distanceKm}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

/* 6.  styles  */
const styles = StyleSheet.create({
    box: {
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
    },
    row: { paddingLeft: 16 },
    chip: {
        backgroundColor: '#eee',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    on: { backgroundColor: '#166534' },
    lbl: { fontSize: 12 },
    lblOn: { color: '#fff', fontWeight: '600' },
    hd: { marginLeft: 16, marginTop: 12, marginBottom: 4, fontWeight: '600' },
});
