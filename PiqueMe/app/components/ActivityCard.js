// app/components/ActivityCard.js

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ActivityCard({ label, title, icon, onPress }) {
    return (
        <View style={styles.wrapper}>
            {/* Bandeau violet */}
            <View style={styles.labelContainer}>
                <FontAwesome5 name="gem" size={12} color="#7B1FA2" />
                <Text style={styles.labelText}>{label}</Text>
            </View>

            {/* Carte cliquable */}
            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
                {/* Container fixe pour l’icône */}
                <View style={styles.iconContainer}>
                    <FontAwesome5
                        name={icon}
                        size={36}            // taille de l’icône à l’intérieur
                        color="#A18F63"
                    />
                </View>

                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    labelText: {
        marginLeft: 4,
        color: '#7B1FA2',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#EAF7EA',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    // ► Container de taille fixe 60×60 pour rendre toutes les icônes uniformes
    iconContainer: {
        width: 60,
        height: 60,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#384028',
        textAlign: 'center',
    },
});
