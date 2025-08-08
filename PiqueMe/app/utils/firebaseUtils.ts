// app/utils/firebaseUtils.ts
import { db, auth } from '../../firebaseConfig'   // ← importe auth et chemin relatif
import {
    collection, query, where, getDocs,
    doc, getDoc, setDoc, updateDoc, deleteDoc,
    onSnapshot, arrayUnion, arrayRemove,
} from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'

//  type utilitaire
export type Park = {
    id: string
    name: string
    imageUri: string
    lat?: number
    lng?: number
    tags?: string[]
}

export function toStableParkId(data: any, fallback: string) {
    return String(data?.NUM_INDEX ?? fallback)
}

/** Récupère un parc par son NUM_INDEX (inchangé) */
export async function getParkById(id: string) {
    try {
        const q = query(collection(db, 'parks'), where('NUM_INDEX', '==', id))
        const snapshot = await getDocs(q)
        if (snapshot.empty) return null
        return snapshot.docs[0].data()
    } catch (error) {
        console.error('Erreur getParkById:', error)
        return null
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
            // on garde ton format d’origine (string) pour ne rien casser
            preferences: '',
            favorites: [],
            createdAt: new Date(),
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

/** Écoute en temps réel un doc utilisateur */
export function subscribeUserDoc(uid: string, cb: (data: any) => void) {
    const ref = doc(db, 'users', uid)
    return onSnapshot(ref, (snap) => cb(snap.data() ?? null))
}

/** Met à jour nom / prénom / préférences */
export async function updateUserProfile(
    uid: string,
    data: Partial<{ firstName: string; lastName: string; preferences: string | string[] }>
) {
    const ref = await ensureUserDoc(uid)
    const patch: any = { ...data }
    if (Array.isArray(patch.preferences)) {
        patch.preferences = patch.preferences.join(',')   // ← on normalise en string
    }
    await updateDoc(ref, patch)
}

/** Abonnement temps réel à la collection 'parks' */
export function subscribeParks(cb: (list: Park[]) => void) {
    const ref = collection(db, 'parks')
    return onSnapshot(ref, (snap) => {
        const list: Park[] = snap.docs.map((d) => {
            const data: any = d.data()
            return {
                id: String(data?.NUM_INDEX ?? d.id),
                name: data?.Nom ?? 'Parc',
                imageUri: 'https://via.placeholder.com/400x200',
                lat: data?.centroid?.lat,
                lng: data?.centroid?.lng,
                tags: Array.isArray(data?.installations)
                    ? data.installations.map((i: any) => String(i?.TYPE ?? '').toLowerCase())
                    : [],
            }
        })
        cb(list)
    })
}

/** Ajoute ou retire un parc des favoris */
export async function toggleFavorite(uid: string, parkId: string, add: boolean) {
    const ref = await ensureUserDoc(uid)
    await updateDoc(ref, {
        favorites: add ? arrayUnion(parkId) : arrayRemove(parkId),
    })
}

/* -------- Suppression compte -------- */

async function deleteUserSubcollection(uid: string, sub: string) {
    const snap = await getDocs(collection(db, 'users', uid, sub))
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

/** Supprime toutes les données Firestore du user */
export async function deleteUserData(uid: string) {
    // Exemple si tu as des sous-collections :
    // await deleteUserSubcollection(uid, 'reviews')
    // await deleteUserSubcollection(uid, 'likes')
    await deleteDoc(doc(db, 'users', uid))
}

/** Supprime complètement le compte (Firestore + Auth) */
export async function deleteAccountCompletely() {
    const user = auth.currentUser            // ← auth est bien importé
    if (!user) throw new Error('Aucun utilisateur connecté')

    await deleteUserData(user.uid)           // 1) Firestore
    await deleteUser(user)                   // 2) Auth (peut demander un recent login)
}
