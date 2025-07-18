// app/(tabs)/Parks/index.js
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Link } from 'expo-router';

import Header from '../../components/Header';
import ParcFavoris from '../../components/parcFavoris';

export default function ParksIndex() {
    return (
        <View style={S.page}>

            {/* bandeau logo‑cœur‑menu */}
            <Header />

            {/* démo de navigation */}
            <Link
                href="/(tabs)/Parks/second"
                style={S.link}
                push
                asChild>
                <Text>Go to Second Page</Text>
            </Link>

            {/* exemple de carte */}
            <ParcFavoris
                id="42"
                name="Parc Jarry"
                imageUri="https://picsum.photos/700"
                rating={4.6}
                reviews={178}
                distanceKm={3.4}
            />
        </View>
    );
}

const S = StyleSheet.create({
    page: { flex: 1 },
    h1:   { fontSize: 24, fontWeight: '700', alignSelf: 'center', marginTop: 12 },
    link: { color: 'blue', textDecorationLine: 'underline', margin: 16 },
});
