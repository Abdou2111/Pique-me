import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import ParcFavoris from './components/parcFavoris';   // ← chemin vers ton composant

type Parc = {
    id: string;
    name: string;
    imageUri: string;
    rating: number;
    reviews: number;
    distanceKm: number;
};

const URL =
    'https://donnees.montreal.ca/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/' +
    'resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json';

export default function TestFavoris() {
    const [data, setData] = useState<Parc[]>([]);

    useEffect(() => {
        (async () => {
            const res  = await fetch(URL);
            const json = await res.json();

            // garde uniquement les véritables “Parc”
            const parsed: Parc[] = json.features
                .filter((f: any) => f.properties.Type?.toLowerCase() === 'parc')
                .map((f: any) => ({
                    id: f.properties.NUM_INDEX,
                    name: [f.properties.Type, f.properties.Lien, f.properties.Nom]
                        .filter(Boolean)
                        .join(' '),
                    imageUri: 'https://via.placeholder.com/400x200',
                    rating: 4.5,          // valeurs de démo
                    reviews: 50,
                    distanceKm: 2.3,
                }));

            setData(parsed.slice(0, 100));  // 10 cartes suffisent pour tester
        })();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                {data.map(p => (
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
