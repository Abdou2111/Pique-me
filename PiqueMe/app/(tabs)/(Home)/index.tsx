import React, { useEffect, useMemo, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import Page  from '../../components/Page';
import Parc  from '../../components/parc';
import { useUserDoc } from '../../context/UserDocContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

/* ---------- types locaux ---------- */
type Park = {
    id: string;
    name: string;
    lat?: number;
    lng?: number;
    imageUri: string;
    tags: string[];
};

/* ---------- helpers ---------- */
const toTag = (txt: string | null | undefined): string | null => {
    const s = (txt ?? '').toLowerCase();
    if (s.includes('aire de jeu'))  return 'aireJeu';
    if (s.includes('récréatif'))    return 'recreatif';
    if (s.includes('plein air'))    return 'pleinAir';
    if (s.includes('pique-nique'))  return 'piqueNique';
    return null;
};

const dist = (
    la1: number,
    lo1: number,
    la2: number,
    lo2: number
): number => {
    const R = 6371e3;
    const φ1 = la1 * Math.PI/180,
        φ2 = la2 * Math.PI/180;
    const dφ = (la2 - la1) * Math.PI/180,
        dλ = (lo2 - lo1) * Math.PI/180;
    const a = Math.sin(dφ/2)**2 +
        Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // mètres
};

/* -------------------------------------------------------------------- */
export default function Home() {
    const { userDoc } = useUserDoc();

    /* --------- Récupération Firestore --------- */
    const [parks, setParks] = useState<Park[]>([]);
    const [loading, setLoad] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const snap = await getDocs(collection(db, 'parks'));
                setParks(snap.docs.map(d => {
                    const p:any = d.data();
                    return {
                        id:   String(p.NUM_INDEX),
                        name: p.Nom ?? 'Parc',
                        lat:  p.centroid?.lat,
                        lng:  p.centroid?.lng,
                        imageUri: 'https://via.placeholder.com/400x200',
                        tags: (p.installations ?? [])
                            .map((i:any)=>toTag(i.TYPE))
                            .filter(Boolean) as string[],
                    };
                }));
            } catch (err) { console.error(err); }
            finally       { setLoad(false); }
        })();
    }, []);

    /* --------- Recommandés --------- */
    const prefs = Array.isArray(userDoc?.preferences)
        ? userDoc!.preferences as string[]
        : [];
    const recommended = useMemo(() => {
        if (!parks.length) return [];
        if (!prefs.length)
            return parks.slice().sort(()=>0.5-Math.random()).slice(0,7);
        const match = parks.filter(p => prefs.every(t => p.tags.includes(t)));
        return (match.length ? match : parks).slice(0,7);
    }, [parks, prefs]);

    /* --------- Proximité 5 km --------- */
    const [coords, setCoords] = useState<{lat:number,lng:number}|null>(null);

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        })();
    }, []);

    const nearParks = useMemo(() => {
        if (!coords) return [];
        return parks
            .filter(p =>
                p.lat !== undefined &&
                p.lng !== undefined &&
                dist(coords.lat, coords.lng, p.lat, p.lng) <= 5000    // ← 5 km
            )
            .slice(0,7);
    }, [parks, coords]);

    /* --------- UI --------- */
    if (loading) {
        return (
            <Page title="Accueil">
                <View style={S.center}><ActivityIndicator size="large"/></View>
            </Page>
        );
    }

    return (
        <Page title="Accueil">
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Section title="Parcs recommandés">
                    <ParcRow data={recommended} />
                </Section>

                <Section title="Parcs à proximité">
                    {coords
                        ? <ParcRow data={nearParks}/>
                        : <Text style={{marginLeft:12}}>Active la géolocalisation pour voir les parcs proches.</Text>}
                </Section>
            </ScrollView>
        </Page>
    );
}

/* ---------------- sous‑composants ---------------- */
const Section = ({ title, children }:{
    title:string; children:React.ReactNode;
}) => (
    <View style={{ marginBottom: 24 }}>
        <Text style={S.h2}>{title}</Text>
        {children}
    </View>
);

function ParcRow({ data }:{ data: Park[] }) {
    if (!data.length)
        return <Text style={{ marginLeft: 12 }}>Aucun résultat.</Text>;

    return (
        <FlatList
            horizontal
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={S.card}>
                    <Parc
                        id={item.id}
                        name={item.name}
                        imageUri={item.imageUri}
                        rating={0}
                        reviews={0}
                        distanceKm={0}
                    />
                </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            showsHorizontalScrollIndicator={false}
        />
    );
}

/* ---------------- styles ---------------- */
const CARD_WIDTH = 180;          // largeur uniforme

const S = StyleSheet.create({
    center:{ flex:1,justifyContent:'center',alignItems:'center' },
    h2:{ fontSize:18,fontWeight:'700',color:'#0f6930',
        marginHorizontal:12,marginBottom:8 },
    card:{ width: CARD_WIDTH, marginRight:12 },   // ← homogène
});
