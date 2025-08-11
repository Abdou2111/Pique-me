//TODO: centrer la carte  sur le parc

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
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Text, IconButton, Icon } from 'react-native-paper';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { getParkById } from '@/app/utils/firebaseUtils';
import Header from '@/app/components/Header';
import Badge from './components/badge';
import { badgesData } from '@/app/(tabs)/Parks/Park/badgesData';
import { TouchableWithoutFeedback } from 'react-native';
import ActivityCard  from "@/app/components/ActivityCard";
import { mapInstallationsToActivities} from "@/app/(tabs)/Parks/Park/functions";
import fakeAvis from "@/app/(tabs)/Parks/Park/fakeAvis";
import AvisList from "@/app/(tabs)/Parks/Park/components/AvisList";
import Commentaire from "@/app/components/commentaire";
import {SafeAreaView} from "react-native-safe-area-context";


const screenWidth = Dimensions.get('window').width;

export default function PageParc() {
    const { id, isFavorite: isFavoriteParam } = useLocalSearchParams();
    const [park, setPark] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [activitiesToDisplay, setActivitiesToDisplay] = useState<any>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [coordonnees, setCoordonnees] = useState<any>(null);

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false, title: '' });
    }, [navigation]);

    const images = [
        'https://picsum.photos/id/1018/800/400',
        'https://picsum.photos/id/1025/800/400',
        'https://picsum.photos/id/1035/800/400',
    ];

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev);
    };
    const router = useRouter();


    const handleImageScroll  = (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setImageIndex(index);
    };

    const handleReservation = () => {
        console.log("Réservation demandée !");
        //console.log("Coordonnées du parc: ", coordonnees);

        const coordAire = getCoordAire();
        //console.log("Coordonnées des aires: ", coordAire);

        console.log("SupaaaaaAAA", park.SUPERFICIE);

        router.push({
            pathname: '/Parks/Reservation/Reservation',
            params: {
                coordParc: JSON.stringify(coordonnees),
                coordAires: JSON.stringify(coordAire),
                superficie: park.SUPERFICIE?.toString() || "0",
                nomParc: park.Nom,
                idParc: id,


            },
        });
    };

    const getCoordAire = () => {
        if (!park || !park.installations) return [];

        return park.installations
            .filter((inst: any) =>
                inst.NOM?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") === "aire de pique-nique"
                && inst.centroid
            )
            .map((inst: any) => ({
                id: inst.ID,
                lat: inst.centroid.lat,
                lng: inst.centroid.lng,
            }));
    };


    useEffect(() => {
        if (typeof isFavoriteParam === 'string') {
            setIsFavorite(isFavoriteParam === 'true');
        }

        (async () => {
            if (typeof id === 'string') {
                const result = await getParkById(id);

                if (result) {
                    //console.log("Installations brutes :", result.installations);
                    setPark(result);
                    setActivitiesToDisplay(mapInstallationsToActivities(result.installations));
                    setCoordonnees(result.centroid);
                    //console.log("centroid :" , result.centroid);
                    //console.log('');
                    //console.log('');
                    //console.log("Saved coords: ", coordonnees);
                    //console.log(result.Nom);
                    //console.log(activitiesToDisplay[0]);
                }

            }
            setLoading(false);
        })();
    }, [id]);

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    if (!park) return <Text style={{ margin: 20 }}>Parc non trouvé.</Text>;
    console.log("Activities to display: ", activitiesToDisplay);





    return (
        <SafeAreaView style={{flex: 1}}>
            <Header title={undefined} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                >
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Flèche de retour */}
                    <View style={styles.topBar}>
                        <IconButton
                            icon="arrow-left"
                            size={28}
                            iconColor="black"
                            onPress={() => router.back()}
                        />
                    </View>

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
                            onMomentumScrollEnd={handleImageScroll}
                        />

                        <View style={styles.paginationDots}>
                            {images.map((_, index) => (
                                <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === imageIndex && styles.activeDot,
                                ]}/>
                            ))}
                        </View>

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


                    <View style={styles.activities}>
                    {Array.isArray(activitiesToDisplay) && activitiesToDisplay.map(activity => (
                        <View key={activity.id} style={styles.activityWrapper}>
                            <ActivityCard
                                title={activity.title}
                                icon={activity.icon}
                                label={activity.label}
                                onPress={() => console.log(activity.id)}
                            />
                        </View>
                        ))}
                    </View>

                    {/*Commentaires*/}
                    <Text style={styles.title}>Avis utilisateurs</Text>
                    <AvisList avisList={fakeAvis} />

                    <Commentaire version={2}/>

                </ScrollView>
            </KeyboardAvoidingView>

            <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
                <Text style={styles.reserveButtonText}>Réserver un spot</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: 32,
        paddingHorizontal: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
        marginHorizontal: 4,
        textAlign: 'justify',
    },
    galleryContainer: {
        position: 'relative',
        height: 240,
        marginBottom: 20,
    },
    imageContainer: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: screenWidth - 32,
        height: 200,
        borderRadius: 16,
        resizeMode: 'cover',
    },
    heartIcon: {
        position: 'absolute',
        top: 16,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    rowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        //marginTop: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        //marginTop: 2,
    },
    ratingText: {
        fontWeight: 'bold',
        marginHorizontal: 6,
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        //marginTop: 0,
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
        padding: 24,
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        paddingTop: 16,
    },
    close: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    activities: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 12,
        paddingBottom: 16,
        paddingTop: 4,
    },
    activityWrapper: {
        width: (screenWidth - 64) / 3, // Trois cartes par ligne, 16*2 padding horizontal + 12*2 gap horizontaux environ
        marginBottom: 16,
        alignItems: 'center', // Centrer les cartes dans leur wrapper (optionnel)
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        //marginTop: 3,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 10,
        height: 10,
        backgroundColor: '#333',
    },

    reserveButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: 'black',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    reserveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    topBar: {

        backgroundColor: '#fff',
        zIndex: 10,
    },


});

