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
                <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5
                            name={icon}
                            size={26}
                            color="#A18F63"
                        />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 0,
    },
    labelText: {
        marginLeft: 4,
        color: '#7B1FA2',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        width: 115,
        height: 115,
        backgroundColor: '#EAF7EA',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0.5},
                shadowOpacity: 0.01,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    // Ajouté pour regrouper l’icône + texte
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        //marginBottom: 6, // petit espace entre icône et titre
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#384028',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
});
