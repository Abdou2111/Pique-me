import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';


export default function PageParc() {
    const { id, name } = useLocalSearchParams();

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18 }}>ID du parc : {id}</Text>
            <Text>Nom du parc : {name}</Text>
            {/* Tu peux aussi afficher image, etc. si tu les passes */}
        </View>
    );
}

