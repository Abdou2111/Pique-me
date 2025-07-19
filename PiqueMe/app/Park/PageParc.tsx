import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    FlatList,
    Dimensions,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { Text, IconButton, Icon } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { getParkById } from '../utils/firebaseUtils';
import Header from '../components/Header';
import Badge from '../Park/components/badge';
import { badgesData } from '@/app/Park/badgesData';
import { TouchableWithoutFeedback } from 'react-native';
import ActivityCard  from "@/app/components/ActivityCard";


const screenWidth = Dimensions.get('window').width;

export default function PageParc() {
    const { id, isFavorite: isFavoriteParam } = useLocalSearchParams();
    const [park, setPark] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);

    const images = [
        'https://picsum.photos/id/1018/800/400',
        'https://picsum.photos/id/1025/800/400',
        'https://picsum.photos/id/1035/800/400',
    ];

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev);
    };

    useEffect(() => {
        if (typeof isFavoriteParam === 'string') {
            setIsFavorite(isFavoriteParam === 'true');
        }

        (async () => {
            if (typeof id === 'string') {
                const result = await getParkById(id);
                setPark(result);
            }
            setLoading(false);
        })();
    }, [id]);

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    if (!park) return <Text style={{ margin: 20 }}>Parc non trouvé.</Text>;

    return (
        <>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Galerie d'images */}
                <View style={styles.galleryContainer}>
                    <FlatList
                        data={images}
                        renderItem={({ item }) => (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item }} style={styles.image} />
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={screenWidth} // Pour scroll constant
                        decelerationRate="fast"
                        snapToAlignment="center"
                        getItemLayout={(_, index) => ({
                            length: screenWidth,
                            offset: screenWidth * index,
                            index,
                        })}
                    />

                    <IconButton
                        icon={isFavorite ? 'heart' : 'heart-outline'}
                        iconColor={isFavorite ? 'red' : 'white'}
                        size={28}
                        style={styles.heartIcon}
                        onPress={toggleFavorite}
                    />
                </View>

                {/* Titre + Rating + Badges */}
                <View style={styles.rowInfo}>
                    {/* Colonne Gauche : Titre + Rating */}
                    <View style={{ flex: 1 }}>
                        <Text variant="titleLarge" style={styles.title}>{park.Nom}</Text>
                        <View style={styles.ratingRow}>
                            <Icon source="star" color="#FFD700" size={20} />
                            <Text style={styles.ratingText}>2.1</Text>
                            <Icon source="cloud" color="lightgrey" size={20} />
                        </View>
                    </View>

                    {/* Colonne Droite : Badges cliquables */}
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <View style={styles.badges}>
                            {badgesData.slice(0, 3).map((badge) => (
                                <Badge
                                    key={badge.id}
                                    icon={badge.icon}
                                    label={badge.label}
                                    color={badge.color}
                                    showLabel={false}
                                />
                            ))}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Modal tous les badges */}
                <Modal transparent visible={visible} animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback onPress={() => {}}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.title}>Tous les badges</Text>
                                    <ScrollView contentContainerStyle={styles.scroll}>
                                        {badgesData.map((badge) => (
                                            <Badge
                                                key={badge.id}
                                                icon={badge.icon}
                                                label={badge.label}
                                                color={badge.color}
                                                showLabel={true}
                                            />
                                        ))}
                                    </ScrollView>
                                    <TouchableOpacity onPress={() => setVisible(false)}>
                                        <Text style={styles.close}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Description */}
                <Text style={styles.title}>Description</Text>
                <Text style={styles.text}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s.
                </Text>

                {/*Activites*/}
                <Text style={styles.title}>Activités</Text>
                <ActivityCard
                    label={"kayak"}
                    title={"Kayak"}
                    icon={'kayak'}
                    onPress={() => alert('Kayak sélectionné')}
                />


                {/* Infos */}
                <Text style={styles.text}>Type : {park.Type}</Text>
                <Text style={styles.text}>ID : {park.NUM_INDEX}</Text>
                <Text style={styles.text}>
                    Installations : {park.installations?.map((i: any) => i.NOM).join(', ') || 'Aucune'}
                </Text>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        paddingHorizontal: 6,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginHorizontal: 6,
        marginTop: 16,
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        marginHorizontal: 20,
        textAlign: 'justify',
    },
    galleryContainer: {
        position: 'relative',
        height: 240,
    },
    imageContainer: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: screenWidth - 40,
        height: 200,
        borderRadius: 16,
        resizeMode: 'cover',
        marginHorizontal: 20,
    },
    heartIcon: {
        position: 'absolute',
        top: 16,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    rowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 12,
        marginTop: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontWeight: 'bold',
        marginHorizontal: 6,
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        height: '50%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        paddingTop: 10,
    },
    close: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007AFF',
        fontWeight: '600',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(133,133,133,0.13)', // plus de voile noir
},
});
