// Affiche la liste des parcs de Montréal

import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import Parc from './parc'

// GeoJSON “Espaces verts” de la Ville de Montréal
const GEOJSON_URL =
    'https://donnees.montreal.ca/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/' +
    'resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json'

// Types pour les données GeoJSON
type ParkFeature = {
    properties: { NUM_INDEX: string; Nom: string }
    geometry: { type: string; coordinates: any }
}

// Type utilisé dans le composant
type ParkData = {
    id: string
    name: string
    imageUri: string
}

export default function ParcList() {
    const [parks, setParks] = useState<ParkData[]>([])
    const [loading, setLoading] = useState(true)
    const [favs, setFavs] = useState<Set<string>>(new Set())

    // Chargement des seuls noms et ID, image toujours placeholder
    useEffect(() => {
        ;(async () => {
            try {
                const res = await fetch(GEOJSON_URL)
                const json = await res.json()
                const features: ParkFeature[] = json.features

                // On crée l'objet ParkData avec une image de substitution
                const data = features.map(feat => ({
                    id: feat.properties.NUM_INDEX,
                    name: feat.properties.Nom,
                    imageUri: 'https://via.placeholder.com/400x200?text=Pas+d%27image',
                }))

                setParks(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    // bascule favoris
    const toggleFav = (id: string, selected: boolean) => {
        setFavs(prev => {
            const next = new Set(prev)
            selected ? next.add(id) : next.delete(id)
            return next
        })
    }

    // Affichage pendant le chargement
    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {parks.map(p => {
                const isFav = favs.has(p.id)
                return (
                    <Parc
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        imageUri={p.imageUri}
                        rating={0}
                        reviews={0}
                        distanceKm={0}
                        initialFavorite={isFav}
                        onToggleFavorite={toggleFav}
                    />
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 16,
    },
})
