/* app/(tabs)/Profile.tsx
   Profil — tags visibles + déconnexion + suppression (redirige vers /)
*/
import React, { useEffect, useState } from 'react'
import {
    ScrollView, View, StyleSheet, Text, Pressable,
    Alert, Button, TextInput, Image
} from 'react-native'
import Page from '../components/Page'
import { useUserDoc } from '../context/UserDocContext'
import { updatePassword, signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { deleteAccountCompletely } from '../utils/firebaseUtils'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import CompoReservation, {Spot, Reservation} from '../components/CompoReservation'
import { getReservation } from '../utils/firebaseUtils'
import { useFocusEffect } from 'expo-router'

import AllResevation from './Parks/Reservation/AllReservation'



/* ————— Tags ————— */
const ALL_TAGS = ['aireJeu', 'recreatif', 'pleinAir', 'piqueNique', 'sport', 'culture'] as const
type TagKey = typeof ALL_TAGS[number]
const LABELS: Record<TagKey | string, string> = {
    aireJeu: 'Aire de jeu',
    recreatif: 'Récréatif',
    pleinAir: 'Plein air',
    piqueNique: 'Pique-nique',
    sport: 'Sport',
    culture: 'Culture'
}
const ICONS: Record<TagKey, keyof typeof Ionicons.glyphMap> = {
    aireJeu: 'game-controller',
    recreatif: 'basketball',
    pleinAir: 'leaf',
    piqueNique: 'restaurant',
    sport: 'barbell',
    culture: 'book'
}


export default function Profile() {
    const { uid, userDoc, updateProfile } = useUserDoc()

    const [firstName, setFirst] = useState('')
    const [lastName,  setLast]  = useState('')
    const [prefs,     setPrefs] = useState<string[]>([])
    const [allReservation, setAllReservations] = useState<Reservation[]>([])
    const [latestReservation, setLatestReservation] = useState<Reservation | null>(null)
    const [hasReservations, setHasReservations] = useState(false)

    useEffect(() => {
        if (!userDoc) return
        setFirst(userDoc.firstName ?? '')
        setLast(userDoc.lastName  ?? '')
        const p = userDoc.preferences
        if (Array.isArray(p)) setPrefs(p as string[])
        else if (typeof p === 'string') setPrefs(p.split(',').map(s => s.trim()).filter(Boolean))
        else setPrefs([])
        console.log(userDoc)
    }, [userDoc])


    useFocusEffect(
        React.useCallback(() => {
            const fetchReservations = async () => {
                const ids = userDoc?.reservations ?? []
                if (!Array.isArray(ids) || ids.length === 0) {
                    setHasReservations(false)
                    setLatestReservation(null)
                    return
                }

                console.log("Les reservation: " + ids)
                const all = await Promise.all(ids.map(id => getReservation(id)))
                const valid = all.filter(r => r !== null)

                valid.sort((a, b) => {
                    const dateA = new Date(a.dateDebut).getTime()
                    const dateB = new Date(b.dateDebut).getTime()
                    return dateB - dateA // plus récent en premier
                })

                setHasReservations(valid.length > 0);
                setLatestReservation(valid[0]);
                setAllReservations(valid);
            }

            fetchReservations()
        }, [userDoc])
    )


    const [showName, setShowName] = useState(false)
    const [showPwd,  setShowPwd]  = useState(false)

    const saveName = (f: string, l: string) => {
        setFirst(f); setLast(l)
        updateProfile({ firstName: f, lastName: l })
        setShowName(false)
    }

    const changePwd = async (pwd: string) => {
        try {
            if (auth.currentUser) await updatePassword(auth.currentUser, pwd)
            Alert.alert('Mot de passe mis à jour')
            setShowPwd(false)
        } catch (e:any) { Alert.alert('Erreur', e.message) }
    }

    /* ——— Actions ——— */
    const handleLogout = async () => {
        await signOut(auth).catch(()=>{})
        router.dismissAll()
        router.replace('/') // app/index.js
    }

    const deleteAccount = () =>
        Alert.alert('Supprimer le compte', 'Action définitive !', [
            { text:'Annuler', style:'cancel' },
            {
                text:'Supprimer',
                style:'destructive',
                onPress: async () => {
                    try {
                        await deleteAccountCompletely()
                        await signOut(auth).catch(()=>{})
                        router.dismissAll()
                        router.replace('/')
                    } catch (e:any) {
                        if (e?.code === 'auth/requires-recent-login') {
                            Alert.alert('Reconnexion requise', 'Veuillez vous reconnecter puis réessayez.')
                        } else {
                            Alert.alert('Erreur', e?.message ?? String(e))
                        }
                    }
                }
            }
        ])

    if (!uid) return <Page title="Profil"><Text>Non connecté.</Text></Page>

    /* ——— Toggle instantané d’un tag (et persistance) ——— */
    const toggleTag = (key: string) => {
        const next = prefs.includes(key) ? prefs.filter(t => t !== key) : [...prefs, key]
        setPrefs(next)
        updateProfile({ preferences: next }) // même logique côté Firestore
    }

    /* Annulation de la reservation */
    const handleCancel = (idReservation: string) => {
        // appeler cancelReservation (idReseva) de firebase utils

    }

    return (
        <Page title="Profil">
            <ScrollView contentContainerStyle={S.ctn}>

                {/* Avatar (visuel) */}
                <View style={S.avatarWrap}>
                    <Image source={require('../../assets/images/avatar.jpg')} style={S.avatar}/>
                    <View style={S.camBadge}><Ionicons name="camera" size={18} color="#fff" /></View>
                </View>

                {/* Informations personnelles */}
                <Card title="Informations personnelles">
                    <Field label="Email" value={auth.currentUser?.email ?? ''} />
                    <Field label="Nom" value={`${firstName} ${lastName}`.trim()} editable onEdit={()=>setShowName(true)} />
                    <Field label="Mot de passe" value="•••••••" editable onEdit={()=>setShowPwd(true)} />
                </Card>

                {/* Préférences — visible 24/7 */}
                <Card title="Préférences">
                    <Text style={S.label}>Tags sélectionnés</Text>
                    <View style={S.tagGrid}>
                        {ALL_TAGS.map(tag => {
                            const selected = prefs.includes(tag)
                            return (
                                <Pressable
                                    key={tag}
                                    onPress={() => toggleTag(tag)}
                                    style={[S.tagChip, selected ? S.tagChipSelected : S.tagChipIdle]}
                                >
                                    <Ionicons
                                        name={ICONS[tag]}
                                        size={16}
                                        color={selected ? '#fff' : '#374151'}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={[S.tagText, selected ? S.tagTextSelected : S.tagTextIdle]}>
                                        {LABELS[tag]}
                                    </Text>
                                </Pressable>
                            )
                        })}
                        {prefs.length === 0 && <Text style={{ color:'#6b7280' }}>Aucun</Text>}
                    </View>
                </Card>

                {/* Mes reservations */}
                <Card title="Mes réservations">
                    {hasReservations && latestReservation ? (
                        <>
                            <CompoReservation
                                reservation={latestReservation}
                                onCancel={() => {handleCancel(latestReservation?.id)}}
                                onConfirm={() => {}}
                            />
                            <Pressable onPress={() => router.push({
                                pathname: '/Parks/Reservation/AllReservation',
                                params: { reservations: JSON.stringify(allReservation) } // ou latestList si tu stockes la liste
                            })}>
                                <Text style={S.linkTxt}>Voir tout ›</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Text style={{ color:'#6b7280' }}>Aucune réservation faite. </Text>
                    )}
                </Card>


                {/* Liens actions */}
                <Pressable onPress={handleLogout} style={S.linkRow}>
                    <Text style={S.linkTxt}>Déconnexion ›</Text>
                </Pressable>

                <Pressable onPress={deleteAccount} style={S.delRow}>
                    <Text style={S.delTxt}>Supprimer mon compte  ›</Text>
                </Pressable>
            </ScrollView>

            {/* Dialogs nom / mot de passe */}
            {showName && <NameDialog first={firstName} last={lastName} onCancel={()=>setShowName(false)} onSave={saveName} />}
            {showPwd  && <PasswordDialog onCancel={()=>setShowPwd(false)} onSave={changePwd} />}
        </Page>
    )
}

/* ————— Sous-composants ————— */
function Card({ title, children }:{ title:string; children:React.ReactNode }) {
    return (
        <View style={S.card}>
            <Text style={S.cardTitle}>{title}</Text>
            {children}
        </View>
    )
}
function Field({ label, value, editable, onEdit }:{
    label:string; value:string; editable?:boolean; onEdit?:()=>void
}) {
    return (
        <View style={S.field}>
            <Text style={S.label}>{label}</Text>
            <View style={S.valueRow}>
                <Text style={S.value}>{value}</Text>
                {editable && <Pressable onPress={onEdit}><Text style={S.edit}>Modifier</Text></Pressable>}
            </View>
        </View>
    )
}

/* ————— Dialogs (inchangés) ————— */
function NameDialog({ first, last, onCancel, onSave }:{
    first:string; last:string; onCancel:()=>void; onSave:(f:string,l:string)=>void
}) {
    const [f,setF]=useState(first); const [l,setL]=useState(last)
    return (
        <Modal>
            <Text style={S.modalTitle}>Modifier le nom</Text>
            <TextInput style={S.input} value={f} onChangeText={setF} placeholder="Prénom" />
            <TextInput style={S.input} value={l} onChangeText={setL} placeholder="Nom" />
            <Btns onCancel={onCancel} onSave={()=>onSave(f,l)} />
        </Modal>
    )
}
function PasswordDialog({ onCancel, onSave }:{
    onCancel:()=>void; onSave:(pwd:string)=>void
}) {
    const [pwd,setPwd]=useState('')
    return (
        <Modal>
            <Text style={S.modalTitle}>Nouveau mot de passe</Text>
            <TextInput style={S.input} value={pwd} secureTextEntry onChangeText={setPwd}/>
            <Btns onCancel={onCancel} onSave={()=>onSave(pwd)} saveDisabled={pwd.length<6}/>
        </Modal>
    )
}
function Modal({ children }:{ children:React.ReactNode }) {
    return (
        <View style={S.modalBg}>
            <View style={S.modalCard}>{children}</View>
        </View>
    )
}
function Btns({ onCancel, onSave, saveDisabled }:{
    onCancel:()=>void; onSave:()=>void; saveDisabled?:boolean
}) {
    return (
        <View style={S.modalBtns}>
            <Button title="Annuler" onPress={onCancel}/>
            <Button title="Enregistrer" onPress={onSave} disabled={saveDisabled}/>
        </View>
    )
}

/* ————— Styles ————— */
const S = StyleSheet.create({
    ctn:{ padding:16, paddingBottom:40, flexGrow:1 },

    avatarWrap:{ alignSelf:'center', marginTop:8, marginBottom:16 },
    avatar:{ width:100, height:100, borderRadius:50, backgroundColor:'#f1f1f1' },
    camBadge:{ position:'absolute', right:-2, bottom:-2, width:28, height:28, borderRadius:14,
        backgroundColor:'#0f6930', justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:'#fff' },

    card:{ backgroundColor:'#fff', borderRadius:12, padding:16, marginBottom:20,
        shadowColor:'#000', shadowOpacity:0.08, shadowRadius:6, elevation:3 },
    cardTitle:{ fontSize:18, fontWeight:'700', marginBottom:10 },

    field:{ marginBottom:14 },
    label:{ color:'#6b7280', marginBottom:6 },
    valueRow:{ flexDirection:'row', alignItems:'center' },
    value:{ flex:1, color:'#111827', fontSize:16 },
    edit:{ color:'#007bff', fontWeight:'600', paddingLeft:12 },

    /* grille 2 colonnes, style “chips” comme le modal */
    tagGrid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:6 },
    tagChip:{ width:'48%', flexDirection:'row', alignItems:'center',
        paddingVertical:10, paddingHorizontal:12, borderRadius:22, marginBottom:10, borderWidth:1 },
    tagChipSelected:{ backgroundColor:'#0f6930', borderColor:'#0f6930' },
    tagChipIdle:{ backgroundColor:'#F3F4F6', borderColor:'#E5E7EB' },
    tagText:{ fontWeight:'600' },
    tagTextSelected:{ color:'#fff' },
    tagTextIdle:{ color:'#374151' },

    linkRow:{ alignSelf:'center', marginTop:6, marginBottom:8 },
    linkTxt:{ color:'#0f6930', fontSize:16 },

    delRow:{ alignSelf:'center', marginTop:6, marginBottom:28 },
    delTxt:{ color:'red', fontSize:16 },

    modalBg:{ position:'absolute', top:0,left:0,right:0,bottom:0, backgroundColor:'#0006',
        justifyContent:'center', alignItems:'center' },
    modalCard:{ backgroundColor:'#fff', padding:20, borderRadius:12, width:'85%' },
    modalTitle:{ fontSize:16, fontWeight:'700', marginBottom:12 },
    modalBtns:{ flexDirection:'row', justifyContent:'flex-end', marginTop:12 },
    input:{ borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:8 },
})
