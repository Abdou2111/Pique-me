import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { router } from 'expo-router';

export default function Header({ title }) {
    return (
        <View style={S.bar}>
            {/* logo à gauche */}
            <Image
                source={require('../../assets/images/Logoo.png')} // ⇒ adapte si ton chemin diffère
                style={S.logo}
            />

            {/* titre centré (optionnel) */}
            {title ? <Text style={S.title}>{title}</Text> : <View style={S.flex} />}

            {/* actions à droite */}
            <View style={S.row}>
                {/* cœur → page Favoris */}
                <IconButton
                    icon="heart"
                    size={26}
                    onPress={() => router.push('/favorites')}
                />
                {/* menu (placeholder) */}
                <IconButton
                    icon="menu"
                    size={26}
                    onPress={() => console.log('menu')}
                />
            </View>
        </View>
    );
}

const S = StyleSheet.create({
    bar:  { flexDirection:'row', alignItems:'center',
        backgroundColor:'#fff', paddingHorizontal:12, paddingVertical:6,
        elevation:4, shadowColor:'#000', shadowOpacity:0.1, shadowRadius:3 },
    logo: { width:120, height:35, resizeMode:'contain' },
    flex: { flex:1 },                 // remplissage quand pas de titre
    title:{ flex:1, textAlign:'center', fontSize:20, fontWeight:'700', color:'green' },
    row:  { flexDirection:'row' },
});
