// but : Composant d'en-tête de l'application
import React, { useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// bibliothèque d’icônes
import { FontAwesome } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';

import logo from '../../assets/images/Logoo.png';

export default function Header({ navigation }) {
    // Etat pour savour si l'utilisateur a mis en favoris ou non
    const [favori, setavori] = useState(false);

    // Fonction pour basculer l'état de favori
    const toggleFavori = () => {
        setavori(!favori);
    };


    return (
        <View style={[styles.container, favori && styles.selected]}>
            {/* Bloc logo-image + slogan */}
            <View style={styles.logoContainer}>
                <Image
                    source={logo}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* Bloc des icônes */}
            <View style={styles.icons}>
                {/* Icône de favoris */}
                <TouchableOpacity onPress={toggleFavori}>
                    <FontAwesome name={favori ? 'heart' : 'heart-o'} size={28} color={favori ? 'red' : 'black'} />
                </TouchableOpacity>

                {/* Bouton menu hamburger */}
                <TouchableOpacity style={styles.menuButton}>
                    <FontAwesome name="bars" size={28} color="black" />
                </TouchableOpacity>
            </View>

        </View>
    );
}


// Styles du composant Header
const styles = StyleSheet.create({
    container: {
        width: '100%',            // ← prend toute la largeur dispo
        alignSelf: 'stretch',     // ← au cas où le parent centre ses enfants
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,      // marge haut/bas
        paddingLeft: 0,           // plus de marge à gauche
        paddingRight: 16,         // garde un peu de marge à droite si tu veux
        backgroundColor: '#fff',
        },
    logoContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1,               // prend tout l’espace dispo

    },
    logoImage: {
        width: 350,
        height: 150,
        paddingRight: 200, // marge à droite pour l'espacement
        resizeMode: 'contain', // adapte la largeur en conservant le ratio

    },
    subtitle: {
        fontSize: 10,
        color: 'black',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        marginLeft: 20,
    },

});













