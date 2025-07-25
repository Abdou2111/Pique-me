/* app/(tabs)/Profile.tsx
   Affichage & édition des infos utilisateur + préférences tags               */

import React, { useEffect, useState } from 'react';
import {
    ScrollView, View, StyleSheet, Text, Pressable,
    Alert, Button, TextInput,
} from 'react-native';
import Page       from '../components/Page';
import TagPicker  from '../components/TagPicker';
import { useUserDoc } from '../context/UserDocContext';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

/* ----------------------------------------------------------------------- */
export default function Profile() {
    const { uid, userDoc, updateProfile } = useUserDoc();

    /* champs locaux ------------------------------------------------------- */
    const [firstName, setFirst] = useState('');
    const [lastName,  setLast]  = useState('');
    const [prefs,     setPrefs] = useState<string[]>([]);

    useEffect(() => {
        if (!userDoc) return;

        setFirst(userDoc.firstName ?? '');
        setLast(userDoc.lastName  ?? '');

        const p = userDoc.preferences;
        if (Array.isArray(p))       setPrefs(p);
        else if (typeof p === 'string')
            setPrefs(p.split(',').map(s => s.trim()).filter(Boolean));
        else                         setPrefs([]);
    }, [userDoc]);

    /* dialogs visibles ---------------------------------------------------- */
    const [showName, setShowName] = useState(false);
    const [showPwd,  setShowPwd]  = useState(false);
    const [showTag,  setShowTag]  = useState(false);

    /* handlers ------------------------------------------------------------ */
    const saveName = (f: string, l: string) => {
        setFirst(f); setLast(l);
        updateProfile({ firstName: f, lastName: l });
        setShowName(false);
    };

    const changePwd = async (pwd: string) => {
        try {
            if (auth.currentUser) await updatePassword(auth.currentUser, pwd);
            Alert.alert('Mot de passe mis à jour');
            setShowPwd(false);
        } catch (e: any) { Alert.alert('Erreur', e.message); }
    };

    const savePrefs = (tags: string[]) => {
        setPrefs(tags);
        updateProfile({ preferences: tags });
        setShowTag(false);
    };

    const deleteAccount = () =>
        Alert.alert('Supprimer le compte', 'Action définitive !', [
            { text:'Annuler',   style:'cancel' },
            { text:'Supprimer', style:'destructive', onPress:() => console.log('TODO') },
        ]);

    /* ---------------------------------- rendu --------------------------- */
    if (!uid) return <Page title="Profil"><Text>Non connecté.</Text></Page>;

    return (
        <Page title="Profil">
            <ScrollView contentContainerStyle={S.ctn}>
                {/* ── infos perso ── */}
                <Card title="Personal Information">
                    <Field label="Email"    value={auth.currentUser?.email ?? ''} />
                    <Field label="Name"     value={`${firstName} ${lastName}`}  editable onEdit={()=>setShowName(true)} />
                    <Field label="Password" value="•••••••"                      editable onEdit={()=>setShowPwd(true)} />
                </Card>

                {/* ── préférences ── */}
                <Card title="Preferences">
                    <Field
                        label="Selected tags"
                        value={prefs.length ? prefs.join(', ') : 'Aucun'}
                        editable
                        onEdit={()=>setShowTag(true)}
                    />
                </Card>

                {/* ── supprimer compte ── */}
                <Pressable onPress={deleteAccount} style={S.delRow}>
                    <Text style={S.delTxt}>Supprimer mon compte  ›</Text>
                </Pressable>
            </ScrollView>

            {/* Dialogs */}
            {showName && <NameDialog first={firstName} last={lastName} onCancel={()=>setShowName(false)} onSave={saveName}/>}
            {showPwd  && <PasswordDialog onCancel={()=>setShowPwd(false)} onSave={changePwd}/> }
            {showTag  && <TagPicker initial={prefs} onCancel={()=>setShowTag(false)} onSave={savePrefs}/> }
        </Page>
    );
}

/* ------------ sous‑composants réutilisables --------------------------- */
function Card({ title, children }:{ title:string; children:React.ReactNode }) {
    return (
        <View style={S.card}>
            <Text style={S.cardTitle}>{title}</Text>
            {children}
        </View>
    );
}

function Field({ label, value, editable, onEdit }:{
    label:string; value:string;
    editable?:boolean; onEdit?:()=>void;
}) {
    return (
        <View style={S.row}>
            <Text style={S.label}>{label}</Text>
            <Text style={S.value}>{value}</Text>
            {editable && <Pressable onPress={onEdit}><Text style={S.edit}>Edit</Text></Pressable>}
        </View>
    );
}

/* dialog nom ----------------------------------------------------------- */
function NameDialog({ first, last, onCancel, onSave }:{
    first:string; last:string; onCancel:()=>void; onSave:(f:string,l:string)=>void;
}) {
    const [f,setF]=useState(first); const [l,setL]=useState(last);
    return (
        <Modal>
            <Text style={S.modalTitle}>Modifier le nom</Text>
            <TextInput style={S.input} value={f} onChangeText={setF} placeholder="Prénom" />
            <TextInput style={S.input} value={l} onChangeText={setL} placeholder="Nom" />
            <Btns onCancel={onCancel} onSave={()=>onSave(f,l)} />
        </Modal>
    );
}

/* dialog password ------------------------------------------------------ */
function PasswordDialog({ onCancel, onSave }:{
    onCancel:()=>void; onSave:(pwd:string)=>void;
}) {
    const [pwd,setPwd]=useState('');
    return (
        <Modal>
            <Text style={S.modalTitle}>Nouveau mot de passe</Text>
            <TextInput style={S.input} value={pwd} secureTextEntry onChangeText={setPwd}/>
            <Btns onCancel={onCancel} onSave={()=>onSave(pwd)} saveDisabled={pwd.length<6}/>
        </Modal>
    );
}

/* petit template modal -------------------------------------------------- */
function Modal({ children }:{ children:React.ReactNode }) {
    return (
        <View style={S.modalBg}>
            <View style={S.modalCard}>{children}</View>
        </View>
    );
}
function Btns({ onCancel, onSave, saveDisabled }:{
    onCancel:()=>void; onSave:()=>void; saveDisabled?:boolean;
}) {
    return (
        <View style={S.modalBtns}>
            <Button title="Annuler"  onPress={onCancel}/>
            <Button title="Enregistrer" onPress={onSave} disabled={saveDisabled}/>
        </View>
    );
}

/* --------------------- styles ---------------------------------------- */
const S = StyleSheet.create({
    ctn:{ padding:16, paddingBottom:100 },

    card:{ backgroundColor:'#fff', borderRadius:12, padding:16,
        marginBottom:24, shadowColor:'#000', shadowOpacity:0.05,
        shadowRadius:6, elevation:3 },
    cardTitle:{ fontSize:18, fontWeight:'700', marginBottom:12 },

    row:{ flexDirection:'row', alignItems:'center', marginVertical:6 },
    label:{ flex:1, color:'#666' },
    value:{ flex:2 },
    edit:{ color:'#007bff' },

    delRow:{ marginTop:24 },
    delTxt:{ color:'red', fontSize:16 },

    /* modal */
    modalBg:{ position:'absolute', top:0,left:0,right:0,bottom:0,
        backgroundColor:'#0006', justifyContent:'center', alignItems:'center' },
    modalCard:{ backgroundColor:'#fff', padding:20, borderRadius:12, width:'85%' },
    modalTitle:{ fontSize:16, fontWeight:'700', marginBottom:12 },
    modalBtns:{ flexDirection:'row', justifyContent:'flex-end', marginTop:12 },

    input:{ borderWidth:1, borderColor:'#ccc', borderRadius:6,
        padding:8, marginBottom:8 },
});
