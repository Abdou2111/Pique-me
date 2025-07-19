import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";

type BadgeProps = {
    color?: string;
    icon: string;
    label: string;
    showLabel?: boolean;
    iconColor?: string;
    size?: number;
};

const Badge: React.FC<BadgeProps> = ({
                                         color = "#21aa28",
                                         icon,
                                         label,
                                         showLabel = true,
                                         iconColor = "black",
                                         size = 45,
                                     }) => {
    return (
        <View style={[styles.wrapper, { margin: showLabel ? 8 : -8 }]}>
            <View style={[styles.circle, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },]}>
                <Icon source={icon} size={size * 0.5} color={iconColor} />
            </View>
            {showLabel && <Text style={styles.label}>{label}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        //margin: -8,
    },
    circle: {
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    label: {
        marginTop: 4,
        fontSize: 12,
        color: "#333",
        textAlign: "center",
    },
});

export default Badge;
