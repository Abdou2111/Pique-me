// app/utils/firebaseUtils.ts
import { db } from '@/firebaseConfig';
import {
    collection, query, where, getDocs,
    doc, getDoc, setDoc, updateDoc,
    onSnapshot, arrayUnion, arrayRemove
} from 'firebase/firestore'

/** Récupère un parc par son NUM_INDEX (fonction ORIGINALE, inchangée) */
export async function getParkById(id: string) {
    try {
        const q = query(collection(db, 'parks'), where('NUM_INDEX', '==', id));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const data = snapshot.docs[0].data();
        return data;
    } catch (error) {
        console.error('Erreur getParkById:', error);
        return null;
    }
}

/** S’assure qu’un doc users/{uid} existe, sinon le crée */
export async function ensureUserDoc(uid: string) {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
        await setDoc(ref, {
            firstName: '',
            lastName: '',
            preferences: '',
            favorites: [],
            createdAt: new Date()
        })
    }
    return ref
}

/** Lit le contenu du doc utilisateur (une fois) */
export async function getUserDoc(uid: string) {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
}

/** Écoute en temps‑réel un doc utilisateur */
export function subscribeUserDoc(uid: string, cb: (data: any) => void) {
    const ref = doc(db, 'users', uid)
    return onSnapshot(ref, (snap) => cb(snap.data() ?? null))
}

/** Met à jour nom / prénom / préférences  */
export async function updateUserProfile(
    uid: string,
    data: Partial<{ firstName: string; lastName: string; preferences: string }>
) {
    const ref = await ensureUserDoc(uid)
    await updateDoc(ref, data)
}

/** Ajoute ou retire un parc des favoris */
export async function toggleFavorite(uid: string, parkId: string, add: boolean) {
    const ref = await ensureUserDoc(uid)
    await updateDoc(ref, {
        favorites: add ? arrayUnion(parkId) : arrayRemove(parkId)
    })
}
