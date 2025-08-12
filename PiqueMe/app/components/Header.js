import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { router } from 'expo-router';

export default function Header() {
    return (
        <View style={S.bar}>
            {/* logo à gauche */}
            <View style={S.left}>
                <Image
                    source={require('../../assets/images/Logoo.png')}
                    style={S.logo}
                />
            </View>

            {/* actions à droite */}
            <View style={S.right}>
                <View style={S.row}>
                    <IconButton
                        icon="heart"
                        size={26}
                        onPress={() => router.push('/favorites')}
                    />
                    <IconButton
                        icon="menu"
                        size={26}
                        onPress={() => console.log('menu')}
                    />
                </View>
            </View>
        </View>

    );
}


const S = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    left: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    logo: {
        width: 160,
        height: 55,
        resizeMode: 'contain',
    },
    row: {
        flexDirection: 'row',
    },
});

