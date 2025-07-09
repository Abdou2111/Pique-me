// components/SearchBar.tsx
import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

type Props = {
    value: string
    onChange: (txt: string) => void
    placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    return (
        <View style={S.box}>
            {/* loupe à gauche */}
            <Ionicons name="search-outline" size={18} color="#8e8e93" style={S.icon} />
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#8e8e93"
                style={[S.input, S.noOutline]}
                clearButtonMode="while-editing"
            />
        </View>
    )
}

const S = StyleSheet.create({
    box:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffffff',
        borderRadius:25,
        paddingLeft:12,          // espace pour l’icône
        paddingRight:16,
        height:40,
        shadowColor:'#000',      // petit flou pour flotter sur la carte
        shadowOpacity:0.1,
        shadowOffset:{width:0,height:1},
        shadowRadius:3,
        elevation:2,             // Android
    },
    icon:{ marginRight:6 },
    input:{ flex:1, fontSize:14 },
    noOutline:{ outlineWidth:0, outlineColor:'transparent' }, // Web
})
