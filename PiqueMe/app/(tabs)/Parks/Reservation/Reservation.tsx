import React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/app/components/Header';

type AireCoord = {
    id: string;
    lat: number;
    lng: number;
};

type Coord = {
    lat: number;
    lng: number;
};

export default function Reservation() {
    const { coordParc, coordAires, superficie, nomParc } = useLocalSearchParams<{
        coordParc?: string;
        coordAires?: string;
        superficie?: string;
        nomParc?: string;
    }>();

    const router = useRouter();

    // Parsing sécurisé
    let parcCoords: Coord[] = [];
    try {
        parcCoords = coordParc ? JSON.parse(coordParc) : [];
    } catch {
        parcCoords = [];
    }

    let aireCoords: AireCoord[] = [];
    try {
        aireCoords = coordAires ? JSON.parse(coordAires) : [];
    } catch {
        aireCoords = [];
    }

    const parcSuperficie = superficie ? parseFloat(superficie) : 0;

    const [region, setRegion] = React.useState<any>(null);
    const [selectedAire, setSelectedAire] = React.useState<AireCoord | null>(null);
    const mapRef = React.useRef<MapView>(null);

    // Images fictives pour les aires
    const images = [
        "https://picsum.photos/200/150",
        "https://picsum.photos/200/150",
        "https://picsum.photos/200/150",
    ];

    React.useEffect(() => {
        if (
            parcCoords.length > 0 &&
            parcCoords.every(c => typeof c.lat === 'number' && typeof c.lng === 'number')
        ) {
            const lats = parcCoords.map(c => c.lat);
            const lngs = parcCoords.map(c => c.lng);

            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            if (isFinite(minLat) && isFinite(maxLat) && isFinite(minLng) && isFinite(maxLng)) {
                const latitude = (minLat + maxLat) / 2;
                const longitude = (minLng + maxLng) / 2;

                let latitudeDelta = (maxLat - minLat) * 1.2 || 0.01;
                let longitudeDelta = (maxLng - minLng) * 1.2 || 0.01;

                if (parcSuperficie > 0) {
                    const deltaFromArea = Math.sqrt(parcSuperficie) / 1000 * 0.009;
                    latitudeDelta = Math.max(latitudeDelta, deltaFromArea);
                    longitudeDelta = Math.max(longitudeDelta, deltaFromArea);
                }

                const newRegion = { latitude, longitude, latitudeDelta, longitudeDelta };
                setRegion(newRegion);

                if (mapRef.current) {
                    mapRef.current.animateToRegion(newRegion, 1000);
                }
            }
        } else {
            const fallbackRegion = {
                latitude: 45.5019,
                longitude: -73.5674,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
            setRegion(fallbackRegion);

            if (mapRef.current) {
                mapRef.current.animateToRegion(fallbackRegion, 1000);
            }
        }
    }, [coordParc, superficie]);

    const handleMarkerPress = (aire: AireCoord, index: number) => {
        setSelectedAire(aire);
    };

    if (!region) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FF0000" />
            </View>
        );
    }

    return (
        <>
            <Header title={undefined} />

            <View style={styles.page}>
                {/* Flèche retour + nom du parc */}
                <View style={styles.textZone}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{nomParc || "Nom du parc"}</Text>
                    </View>

                    {/* Zone texte */}
                    <Text style={styles.text}>
                        Sélectionnez un spot en cliquant {'\n'}
                        sur un des pins.
                    </Text>
                </View>

                {/* Carte */}
                <View style={styles.mapContainer}>
                    <MapView ref={mapRef} style={styles.map} initialRegion={region}>
                        {parcCoords.length > 0 && (
                            <Polygon
                                coordinates={parcCoords.map(c => ({
                                    latitude: c.lat,
                                    longitude: c.lng,
                                }))}
                                strokeColor="red"
                                strokeWidth={2}
                                lineDashPattern={[6, 6]}
                                fillColor="rgba(255,0,0,0.05)"
                            />
                        )}

                        {aireCoords.map((aire, index) => (
                            <Marker
                                key={aire.id}
                                coordinate={{ latitude: aire.lat, longitude: aire.lng }}
                                title={`Aire ${index + 1}`}
                                pinColor={selectedAire?.id === aire.id ? "blue" : "green"}
                                onPress={() => handleMarkerPress(aire, index)}
                            />
                        ))}
                    </MapView>
                </View>

                {/* Section Aire avec images */}
                <View style={styles.aireSection}>
                    <Text style={styles.aireTitle}>
                        {selectedAire
                            ? `Aire ${aireCoords.findIndex(a => a.id === selectedAire.id) + 1}`
                            : "Aire 1"}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                        {images.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.aireImage} />
                        ))}
                    </ScrollView>
                </View>

                {/* Bouton réserver */}
                <TouchableOpacity style={styles.reserveButton}>
                    <Text style={styles.reserveButtonText}>Réserver le spot</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        gap: 10,
    },
    backButton: { marginRight: 10 },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    textZone: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd"
    },
    mapContainer: { flex: 1 },
    map: { flex: 1 },
    aireSection: {
        padding: 10,
        backgroundColor: "#fafafa",
        height: 120,
        zIndex: 1,
        marginBottom: 65,
    },
    aireTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    imageScroll: { flexDirection: "row" },
    aireImage: { width: 120, height: 100, borderRadius: 8, marginRight: 8 },
    reserveButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "black",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 3,
    },
    reserveButtonText: { color: "#fff", fontWeight: "bold" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
        marginHorizontal: 15,
        textAlign: 'justify',
    },
});
