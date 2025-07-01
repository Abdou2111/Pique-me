// Description: implementation d'un carousel d'images avec un cœur favori
import React, { useState}  from "react";
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    NativeSyntheticEvent,
    NativeScrollEvent,
    LayoutChangeEvent
} from "react-native";
import {  IconButton } from "react-native-paper"; // Pour le bouton cœur

interface Props {
    images: string[];                             // Liste d’URL des images à afficher
    initialFavorite?: boolean;                    // État initial du cœur (favori ou non)
    onFavoriteToggle?: (fav: boolean) => void;    // Callback quand on active/désactive le favori
}

const SpotsImages: React.FC<Props> = ({
    images,
    initialFavorite = false,
    onFavoriteToggle
}) => {

    // État pour savoir si l'image est favorite ou non
    const [Favorite, setIsFavorite] = useState(initialFavorite);
    // Indice de l'image actuellement affichée
    const [currentIndex, setCurrentIndex] = useState(0);
    // Largeur du componet
    const [width, setWidth] = useState(0);

    // Fonction pour changer l'état du favori
    const toggleFavorite = () => {
        const next = !Favorite;
        setIsFavorite(next);
            onFavoriteToggle?.(next);
    };

    // Fonction pour gérer le scroll et mettre à jour l'indice de l'image affichée
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const idx = Math.round(x / width);
        setCurrentIndex(idx);
    };

    // Recupérer la largeur du composant
    const handleLayout = (event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    };

    return (
        // wrapper principal avec coins arrondis
        <View style={styles.wrapper} onLayout={handleLayout}>
            {/* L'image scrollable */}
            <ScrollView
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                >
                {images.map((uri, index) => (
                    <View
                        key={index}
                        style={[styles.imageContainer, { width }]} // chaque slide a la largeur du wrapper
                    >
                        <Image source={{ uri }} style={styles.image} />
                        {/* Bouton cœur en superposition */}
                        <IconButton
                            icon={Favorite ? "heart" : "heart-outline"}
                            iconColor={Favorite ? "red" : "white"}
                            size={24}
                            onPress={toggleFavorite}
                            style={styles.heart}
                        />
                    </View>
                ))}
            </ScrollView>

            { /* Pagination: barre en bas indiquant l'image actuelle */ }
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex
                                ? styles.activeDot
                                : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#FAF7E8", // fond crème
        borderRadius: 16,
        overflow: "hidden",
        margin: 16,
    },
    imageContainer: {
        position: "relative", // pour superposer le cœur
        height: 200,          // hauteur fixe du carousel
    },
    image: {
        width: "100%",
        height: "100%",
    },
    heart: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.4)", // cercle semi-transparent
        borderRadius: 20,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 8,
    },
    dot: {
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 60,
        backgroundColor: "#333",
    },
    inactiveDot: {
        width: 60,
        backgroundColor: "#DDD",
    },
});

export default SpotsImages;








