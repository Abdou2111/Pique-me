// laisser des etoiles pour évaluer un élément
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface Props {
    iconName: string;       // nom FA5, ex: 'leaf'
    title: string;          // label
    rating: number;         // note entre 0 et 5
    maxStars?: number;      // défaut = 5
}

const RatingCard: React.FC<Props> = ({
                                         iconName,
                                         title,
                                         rating,
                                         maxStars = 5,
                                     }) => {
    const stars = Array.from({ length: maxStars }).map((_, index) => {
        const position = index + 1;
        // Détermine le type d’étoile
        let name: "star" | "star-half-alt" = "star";
        let solid = false;
        let color = "#DDD";

        if (rating >= position) {
            // pleine
            solid = true;
            color = "#FFC107";
        } else if (rating >= position - 0.5) {
            // demi
            name = "star-half-alt";
            solid = true;
            color = "#FFC107";
        }

        return (
            <FontAwesome5
                key={index}
                name={name}
                size={16}
                solid={solid}
                color={color}
                style={{ marginHorizontal: 2 }}
            />
        );
    });

    return (
        <View style={styles.wrapper}>
            <View style={styles.iconContainer}>
                <FontAwesome5 name={iconName} size={20} color="#388E3C" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.starsContainer}>{stars}</View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#FFF",
        borderRadius: 8,
        marginVertical: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#C8E6C9",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    starsContainer: {
        flexDirection: "row",
    },
});

export default RatingCard;
