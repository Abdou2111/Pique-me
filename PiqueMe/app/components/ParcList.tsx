// ParcList.tsx — même logique, lecture depuis Firestore
import React, { useEffect, useState, useMemo } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native'
import Parc        from './parc'
import ParcFavoris from './parcFavoris'

// Firebase
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

// Types
export type ParkData = {
    id:string; name:string; imageUri:string; filters:string[]
}
type Props = {
    parks?: ParkData[]
    filterQuery?: string
    filterTags?:  string[]
    useFavorisCard?: boolean
    onCountChange?: (n:number)=>void
}

const norm = (s:string) =>
    s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim()

const toTag = (t:string|null|undefined) => {
    const s = (t ?? '').toLowerCase()
    if (s.includes('aire de jeu'))  return 'aireJeu'
    if (s.includes('récréatif'))    return 'recreatif'
    if (s.includes('plein air'))    return 'pleinAir'
    if (s.includes('pique-nique'))  return 'piqueNique'
    return null
}

export default function ParcList({
                                     parks,
                                     filterQuery = '',
                                     filterTags  = [],
                                     useFavorisCard = false,
                                     onCountChange,
                                 }: Props) {

    const [all,     setAll]  = useState<ParkData[]>(parks ?? [])
    const [loading, setLoad]  = useState(!parks)   // skip spinner if data given

    /* fetch unique via Firestore */
    useEffect(() => {
        if (parks) {                 // prop present just mirror it
            setAll(parks)
            setLoad(false)
            return
        }
        // Sinon fetch depuis Firestore
        (async () => {
            try {
                const snap = await getDocs(collection(db, 'parks'))
                const list = snap.docs.map(d => {
                    const p:any = d.data()
                    return {
                        id:   p.NUM_INDEX,
                        name: [p.Type, p.Lien, p.Nom].filter(Boolean).join(' '),
                        imageUri:'https://via.placeholder.com/400x200',
                        filters:(p.installations ?? [])
                            .map((i:any)=>toTag(i.TYPE))
                            .filter(Boolean),
                    } as ParkData
                })
                setAll(list)
            } catch(e){ console.error(e) }
            finally   { setLoad(false) }
        })()
    }, [parks]) // rerun only if `parks` changes


    /* filtrage */
    const shown = useMemo(() => all.filter(p =>
        (!filterQuery || norm(p.name).includes(norm(filterQuery))) &&
        (!filterTags.length || filterTags.every(t => (p.filters ?? []).includes(t)))
    ), [all, filterQuery, filterTags])

    /* notifier Search du nombre */
    useEffect(()=>{ onCountChange?.(shown.length) },[shown.length])

    if (loading)       return <ActivityIndicator style={{flex:1}} size="large"/>
    if (!shown.length) return <Text style={styles.empty}>Aucun parc trouvé</Text>

    const Card = useFavorisCard ? ParcFavoris : Parc

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {shown.map((p, idx) => (
                <Card
                    key={`${p.id}-${idx}`}
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
