// app/(tabs)/Search.js

import React, { useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons }        from '@expo/vector-icons'
import SearchBar           from '../components/SearchBar'
import ParcList            from '../components/ParcList'

const FILTERS = [
    { id:'bbq',      label:'BBQ disponible',    icon:'flame' },
    { id:'feu',      label:'Feu permis',        icon:'bonfire' },
    { id:'sport',    label:'Terrain sport',     icon:'trophy' },
    { id:'aireJeu',  label:'Aire de jeu',       icon:'game-controller' },
    { id:'chiens',   label:'Chiens OK',         icon:'paw' },
    { id:'tables',   label:'Table pique-nique', icon:'restaurant' },
    { id:'toilettes',label:'Toilettes',         icon:'water' },
    { id:'parking',  label:'Parking',           icon:'car' },
    { id:'wifi',     label:'Wi-Fi',             icon:'wifi' },
    { id:'eau',      label:'Fontaine à eau',    icon:'water' },
]

const norm = s =>
    s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim()

export default function Search() {
    const [query,  setQuery]  = useState('')
    const [active, setActive] = useState(new Set())
    const [count,  setCount]  = useState(0)
    const [parks,  setParks]  = useState([]) // removed TS generic

    const toggle = id => {
        const next = new Set(active)
        next.has(id) ? next.delete(id) : next.add(id)
        setActive(next)
    }

    return (
        <SafeAreaView style={S.flex}>
            {/* carte + markers */}
            <MapView
                style={S.map}
                initialRegion={{
                    latitude:  45.5019,
                    longitude: -73.5674,
                    latitudeDelta:  0.09,
                    longitudeDelta: 0.04,
                }}
            >
                {parks.map(p => (
                    <Marker
                        key={`${p.id}-${p.latitude}`}
                        coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                        title={p.name}
                    />
                ))}
            </MapView>

            {/* recherche + tags */}
            <View style={S.topOverlay}>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Rechercher des parcs…"
                />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={S.tagRow}
                >
                    {FILTERS.map(t => {
                        const on = active.has(t.id)
                        return (
                            <Pressable
                                key={t.id}
                                onPress={() => toggle(t.id)}
                                style={[S.chip, on && S.chipOn]}
                            >
                                <Ionicons
                                    name={on ? t.icon : `${t.icon}-outline`}
                                    size={16}
                                    color={on ? '#fff' : '#444'}
                                    style={{ marginRight:6 }}
                                />
                                <Text style={[S.txt, on && S.txtOn]}>{t.label}</Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            {/* liste bas */}
            <View style={S.listPanel}>
                <View style={S.header}>
                    <View style={S.handle}/>
                    <Text style={S.title}>{count} Résultats</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom:32 }}>
                    <ParcList
                        filterQuery={norm(query)}
                        filterTags={[...active]}
                        useFavorisCard={true}
                        onCountChange={setCount}
                        onResultsChange={setParks}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const S = StyleSheet.create({
    flex:{ flex:1, backgroundColor:'#fff' },
    map: StyleSheet.absoluteFillObject,

    topOverlay:{
        position:'absolute',
        top:10,
        width:'100%',
        paddingHorizontal:12,
    },
    tagRow:{ flexDirection:'row', alignItems:'center', marginTop:8 },

    chip:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#f0f0f0',
        borderRadius:22,
        paddingHorizontal:12,
        paddingVertical:6,
        marginRight:8,
    },
    chipOn:{ backgroundColor:'#0f6930' },

    txt:{ fontSize:12, color:'#444' },
    txtOn:{ color:'#fff', fontWeight:'600' },

    listPanel:{
        position:'absolute',
        bottom:0,
        width:'100%',
        height:320,
        backgroundColor:'#fff',
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
        shadowColor:'#000',
        shadowOpacity:0.1,
        shadowRadius:6,
        elevation:6,
        paddingHorizontal:12,
        paddingTop:8,
    },

    header:{
        alignItems:'center',
        paddingTop:6,
    },
    handle:{
        width:40,
        height:4,
        borderRadius:2,
        backgroundColor:'#0003',
        marginBottom:6,
    },
    title:{
        fontWeight:'600',
        fontSize:16,
    },
})
