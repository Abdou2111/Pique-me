// Description: Composant React Native pour afficher une carte d'activité avec un label, un titre et une icône.
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

    labelText: {
        marginLeft: 4,
        color: '#7B1FA2',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        width: 150,
        height: 150,
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
