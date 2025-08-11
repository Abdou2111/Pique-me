// app/(tabs)/Parks/Favorites.js
import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import Header from '../../components/Header'
import Favoris from '../../components/Favoris'
import {SafeAreaView} from "react-native-safe-area-context";

const API_URL = 'http://localhost:3000'

export default function FavoritesScreen() {
    const [parks, setParks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/parks`)
            .then(r => r.json())
            .then(data => setParks(data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Parcs favoris" />
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <Favoris parks={parks} />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    loader:    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
