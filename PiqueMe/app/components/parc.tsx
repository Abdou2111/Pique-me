import * as React from 'react';
import { Avatar, Button, Card, Text, Icon, MD3Colors, IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

// Apres avec la BD il va falloir modifier pour passer dynamiquement les informations du parc
const CompoParc = () => {
    const [favori, setFavori] = React.useState<boolean>(false);
    const toggleFavori = () => {
        setFavori(!favori);
    };

    // affichage dans favoris: changer card, image, content et remettre le style ligne.
    // Quand on aura les pages mettre des if (utiliser route.name === 'Favoris') ternaire pour set automatiquement le style de l'affichage
    return (
        <Card style={styles.card}>
            {/*Quand la page favoris sera là tester pour voir si l'affichage change*/}
            {/*<Card style={route.name === 'Favoris'? styles.cardFavoris : styles.card}>*/}

            {/* View qui aligne image + contenu horizontalement : style={styles.ligne}*/}
            <View >

                {/* Image + coeur */}
                <View style={styles.imageContainer}>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={styles.image} />
                    <IconButton
                        icon={favori ? 'heart' : 'heart-outline'}
                        iconColor={favori ? 'red' : 'white'}
                        size={24}
                        style={styles.icon}
                        onPress={toggleFavori}
                    />
                </View>

                {/* Contenu à droite: */}
                <View style={styles.content}>
                    <Text variant="titleLarge" style={styles.title}>Parc Jarry</Text>
                    <View style={styles.noteParc}>
                        <Icon source="star" color="#FFD700" size={20} />
                        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>4.6</Text>
                        <Text style={styles.text2}>(178 reviews)</Text>
                    </View>
                    <Text variant="bodyMedium" style={{ color: 'gray' }}>À 3.4 km</Text>
                </View>

            </View>

            {/*<Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>*/}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 260,
        backgroundColor: 'white',
        margin: 16,
        flexDirection: 'column',
    },

    cardFavoris: {
        width: '90%',
        backgroundColor: 'white',
        margin: 16,
    },

    ligne: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        color: 'green',
    },

    text2: {
        marginLeft: 8,
        color: 'grey',
    },

    imageContainer: {
        position: 'relative',
    },

    image: {
        padding: 8,
        height: 140,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
    },

    imageFavoris: {
        height: 110,
        width: 160,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
    },

    content:{
        justifyContent: 'center',
        margin: 10,
    },

    contentFavoris: {
        flex: 1,
        justifyContent: 'center',
        margin: 10,
    },



    icon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.4)', // petit fond sombre pour la lisibilité
        borderRadius: 30,
    },

    noteParc: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 4,
    },

    star: {
        marginRight: 4,
    },
});

export default CompoParc;