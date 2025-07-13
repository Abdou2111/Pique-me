import React, { useEffect, useState, useMemo} from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, Text, View } from 'react-native'
import Parc        from './parc'        // carte “normale”
import ParcFavoris from './parcFavoris' // carte “favori”

type ParkFeature = {
    properties:{ NUM_INDEX:string; Nom:string; Type?:string; Lien?:string }
}
export type ParkData = {
    id:string; name:string; imageUri:string; filters:string[]
}
type Props = {
    filterQuery?: string       // texte déjà normalisé
    filterTags?:  string[]     // tags actifs
    useFavorisCard?: boolean   // vrai → ParcFavoris
    onCountChange?: (n:number)=>void // callback résultat
}

const URL =
    'https://donnees.montreal.ca/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/' +
    'resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json'

const norm = (s:string) =>
    s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim()

export default function ParcList({
                                     filterQuery = '',
                                     filterTags  = [],
                                     useFavorisCard = false,
                                     onCountChange,
                                 }: Props) {

    const [parks, setParks]   = useState<ParkData[]>([])
    const [loading, setLoad]  = useState(true)

    /* fetch unique */
    useEffect(() => {
        ;(async () => {
            try {
                const json = await (await fetch(URL)).json()
                const list = (json.features as ParkFeature[])
                    .filter(f => f.properties.Type?.toLowerCase() === 'parc')
                    .map(f => ({
                        id:   f.properties.NUM_INDEX,
                        name: [f.properties.Type,f.properties.Lien,f.properties.Nom]
                            .filter(Boolean).join(' '),
                        imageUri:'https://via.placeholder.com/400x200',
                        filters: ['bbq','sport','parking'].filter(()=>Math.random()<.5),
                    }))
                setParks(list)
            } catch(e){ console.error(e) }
            finally   { setLoad(false) }
        })()
    }, [])

    /* filtrage */
    const shown = useMemo(() => parks.filter(p =>
        (!filterQuery || norm(p.name).includes(filterQuery)) &&
        (!filterTags.length || filterTags.every(t => p.filters.includes(t)))
    ), [parks, filterQuery, filterTags])

    /* notifier Search du nombre */
    useEffect(()=>{ onCountChange?.(shown.length) },[shown.length])

    if (loading)       return <ActivityIndicator style={{flex:1}} size="large"/>
    if (!shown.length) return <Text style={styles.empty}>Aucun parc trouvé</Text>

    const Card = useFavorisCard ? ParcFavoris : Parc

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {shown.map(p => (
                <Card
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    imageUri={p.imageUri}
                    rating={0}
                    reviews={0}
                    distanceKm={0}
                />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:16},
    empty:{margin:20,textAlign:'center'},
})
