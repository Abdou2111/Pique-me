import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Icon, Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export type AvisData = {
    idAvis: number;
    userName: string;
    contenu: string;
    images: string[];
    rating: number;
};

export type AvisProps = AvisData;

const Avis: React.FC<AvisProps> = ({
                                       userName,
                                       contenu,
                                       images = [],
                                       rating,
                                   }) => {
    const stars = [];
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    for (let i = 0; i < rating; i++) {
        stars.push(
            <Icon key={`full-${i}`} source="star" color="#FFD700" size={20} />
        );
    }

    for (let j = 0; j < 5 - rating; j++) {
        stars.push(
            <FontAwesome5
                key={`empty-${j}`}
                name="star"
                size={15}
                color="#FFD700"
                style={{ margin: 2 }}
            />
        );
    }

    const scrollToImages = (index: number) => {
        const nextIndex = Math.max(0, Math.min(index, images.length - 1));
        setCurrentImageIndex(nextIndex);
        const offset = Math.floor(nextIndex / 3) * screenWidth;
        scrollViewRef.current?.scrollTo({ x: offset, animated: true });
    };

    const getImageDisplay = () => {
        const shown = images.slice(currentImageIndex, currentImageIndex + 2);
        const hasPrevious = currentImageIndex > 0;
        const hasNext = currentImageIndex + 2 < images.length;

        return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {hasPrevious && (
                    <TouchableOpacity onPress={() => scrollToImages(currentImageIndex - 2)}>
                        <View style={styles.overlayContainer}>
                            <Image
                                source={{ uri: images[currentImageIndex - 1] }}
                                style={styles.image}
                            />
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>+{currentImageIndex}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {shown.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={styles.image} />
                ))}

                {hasNext && (
                    <TouchableOpacity onPress={() => scrollToImages(currentImageIndex + 2)}>
                        <View style={styles.overlayContainer}>
                            <Image
                                source={{ uri: images[currentImageIndex + 2] }}
                                style={styles.image}
                            />
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>
                                    +{images.length - (currentImageIndex + 2)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <Card style={styles.card}>
            <View style={styles.container}>
                <View style={styles.ratingContainer}>
                    <FontAwesome5 name={"user-circle"} size={40} color={"black"} />
                    <View style={styles.column}>
                        <Text style={styles.user}>{userName}</Text>
                        <View style={styles.ratingContainer}>{stars}</View>
                    </View>
                </View>

                <Text style={styles.text}>{contenu}</Text>

                {images.length > 0 && (
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        {getImageDisplay()}
                    </ScrollView>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 6,
        backgroundColor: "#fffed4",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    container: {
        margin: 10,
    },
    ratingContainer: {
        flexDirection: "row",
    },
    column: {
        flexDirection: "column",
        alignItems: "flex-start",
        marginHorizontal: 10,
    },
    user: {
        fontWeight: "bold",
        fontSize: 20,
    },
    text: {
        fontSize: 16,
        margin: 10,
        textAlign: "justify",
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 8,
    },
    overlayContainer: {
        position: "relative",
        width: 100,
        height: 100,
        marginRight: 10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    overlayText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default Avis;
