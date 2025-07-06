// Affiche la liste des parcs de Montréal
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Parc from './parc';

// GeoJSON “Espaces verts” de la Ville de Montréal
const GEOJSON_URL =
    'https://donnees.montreal.ca/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/' +
    'resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json';

type ParkFeature = {
    properties: {
        NUM_INDEX: string;
        Nom: string;
        Type?: string;      // ← préfixe (« Parc », « Square »…)
        Lien?: string;      // ← article (« du », « de la »…)
        TYPO1?: string;     // non utilisé ici
    };
    geometry: { type: string; coordinates: any };
};

type ParkData = {
    id: string;
    name: string;
    imageUri: string;
};

export default function ParcList() {
    const [parks, setParks] = useState<ParkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [favs, setFavs] = useState<Set<string>>(new Set());

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(GEOJSON_URL);
                const json = await res.json();
                const features: ParkFeature[] = json.features ?? [];

                // Garder uniquement les enregistrements dont Type === 'Parc'
                const parksOnly = features.filter(
                    f => f.properties.Type?.toLowerCase() === 'parc'
                );

                const data = parksOnly.map(p => ({
                    id: p.properties.NUM_INDEX,
                    name: [p.properties.Type, p.properties.Lien, p.properties.Nom]
                        .filter(Boolean)
                        .join(' '),
                    imageUri:
                        'https://via.placeholder.com/400x200?text=Pas+d%27image',
                }));

                setParks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const toggleFav = (id: string, selected: boolean) => {
        setFavs(prev => {
            const next = new Set(prev);
            selected ? next.add(id) : next.delete(id);
            return next;
        });
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    if (!parks.length) return <Text style={{ margin: 20 }}>Aucun parc reçu</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {parks.map(p => (
                <Parc
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    imageUri={p.imageUri}
                    rating={0}
                    reviews={0}
                    distanceKm={0}
                    initialFavorite={favs.has(p.id)}
                    onToggleFavorite={toggleFav}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 16,
    },
});
