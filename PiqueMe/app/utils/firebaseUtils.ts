// app/utils/firebaseUtils.ts
import { db, auth } from '../../firebaseConfig'   // ← importe auth et chemin relatif
import {
    collection, query, where, getDocs,
    doc, getDoc, setDoc, updateDoc, deleteDoc,
    onSnapshot, arrayUnion, arrayRemove,
    addDoc, Timestamp
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
import fakeAvis from "@/app/(tabs)/Parks/Park/fakeAvis";
import { Reservation } from '../components/CompoReservation'

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

/**
 * Crée une nouvelle réservation dans Firestore
 * @param idParc - identifiant du parc
 * @param dateDebut - objet Date ou Timestamp du début
 * @param dateFin - objet Date ou Timestamp de fin
 * @param userId - identifiant de l'utilisateur
 * @returns JSON { success: boolean, message: string, idReservation?: string }
 */
export async function createReservation(
    idParc: string,
    idSpot: string,
    spotLabel: string,
    dateDebut: Date,
    dateFin: Date,
    userId: string
) {
    try {
        console.log("c-1");
        // Validation des entrées
        if (!idParc || !idSpot || !dateDebut || !dateFin || !userId) {
            console.log("c-2");
            return {
                success: false,
                message: "Champs manquants pour créer la réservation"
            };
        }
        console.log("c-3");

        if (dateDebut >= dateFin) {
            console.log("c-4");
            return {
                success: false,
                message: "La date de début doit être avant la date de fin"
            };
        }

        console.log("c-5");
        // Création de l'objet à stocker
        const reservationData = {
            etat: "en attente",
            dateDebut: Timestamp.fromDate(dateDebut),
            dateFin: Timestamp.fromDate(dateFin),
            idParc,
            spot: {idSpot, spotLabel},
            userId,
            confirmation1: false,
            confirmation2: false,
            createdAt: Timestamp.now()
        };
        console.log("c-6");
        console.log(JSON.stringify(reservationData, null, 2));

        // Ajout dans Firestore
        const docRef = await addDoc(collection(db, "reservations"), reservationData);

        console.log("c-7"); // Erreur au moment de l'ajout dans FS

        // Ajout de la reservation dans la BD du user
        const addToUser = await addReservationToUser(userId, docRef.id );
        if (addToUser.success) {
            return {
                success: true,
                message: "Réservation créée avec succès",
                idReservation: docRef.id
            };
        }
        else {
            return {
                success: false,
                message: addToUser.message,
            }
        }


    } catch (error) {
        console.log("c-8");
        console.error("Erreur createReservation:", error);
        return {
            success: false,
            message: "Erreur lors de la création de la réservation"
        };
    }
}

/**
 * Ajoute une réservation à l'utilisateur dans Firestore
 * @param uid - identifiant de l'utilisateur
 * @param idReservation - identifiant de la réservation
 * @returns JSON { success: boolean, message: string }
 */
export async function addReservationToUser(uid: string, idReservation: string) {
    try {
        const userRef = await ensureUserDoc(uid); // récupère ou crée le doc utilisateur
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Si le doc n'existe pas, on le crée avec le champ reservations
            //await updateDoc(userRef, { reservations: [idReservation] });
            return { success: true, message: 'Utilisateur non existant.' };//créé et réservation ajoutée.' };
        }

        const userData = userSnap.data();

        if (!userData.reservations || !Array.isArray(userData.reservations)) {
            // Si le champ n'existe pas ou est invalide, on le crée
            await updateDoc(userRef, { reservations: [idReservation] });
            return { success: true, message: 'Champ reservations créé et réservation ajoutée.' };
        }

        // Ajout sécurisé avec arrayUnion
        await updateDoc(userRef, {
            reservations: arrayUnion(idReservation)
        });

        return { success: true, message: 'Réservation ajoutée avec succès.' };
    } catch (error) {
        console.error('Erreur dans addReservationToUser:', error);
        return { success: false, message: 'Échec de l’ajout de la réservation.' };
    }
}

/**
 * Récupère une réservation par son ID depuis Firestore
 * @param idReservation - identifiant de la réservation
 * @returns un objet contenant les données de la réservation ou null si introuvable
 */
export async function getReservation(idReservation: string)
    : Promise<Reservation | null> {

    try {
        const ref = doc(db, 'reservations', idReservation);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            console.warn('Réservation introuvable:', idReservation);
            return null;
        }

        const data = snap.data()

        // Vérification facultative pour s'assurer que les champs existent
        if (!data.dateDebut || !data.dateFin || !data.spot || !data.idParc) {
            console.warn('Données de réservation incomplètes:', data)
            return null
        }

        return {
            id: snap.id,
            confirmation2: data.confirmation2,
            createdAt: data.createdAt.toDate?.() ?? new Date(data.createdAt),
            dateDebut: data.dateDebut.toDate?.() ?? new Date(data.dateDebut),
            dateFin: data.dateFin.toDate?.() ?? new Date(data.dateFin),
            etat: data.etat,
            idParc: data.idParc,
            spot: data.spot,
            userId: data.userId
        }
    } catch (error) {
        console.error('Erreur getReservation:', error);
        return null;
    }
}


/**
 * Annule une réservation en supprimant son ID du profil utilisateur
 * et en supprimant le document de la collection 'reservations'
 * @param {string} reservationId - ID de la réservation à annuler
 * @returns {Promise<Object>} - Résultat de l’opération au format JSON
 */
export async function cancelReservation(reservationId: string) {
    try {
        // 1. Récupérer la réservation
        const reservationRef = doc(db, 'reservations', reservationId)
        const reservationSnap = await getDoc(reservationRef)

        if (!reservationSnap.exists()) {
            return {
                success: false,
                message: `Réservation avec l'ID ${reservationId} introuvable.`
            }
        }

        const reservationData = reservationSnap.data()
        const userId = reservationData.userId

        if (!userId) {
            return {
                success: false,
                message: `Le champ userId est manquant dans la réservation ${reservationId}.`
            }
        }

        // 2. Supprimer l'ID de réservation du tableau de l'utilisateur
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
            reservations: arrayRemove(reservationId)
        })

        // 3. Supprimer le document de la collection 'reservations'
        await deleteDoc(reservationRef)

        return {
            success: true,
            message: `Réservation ${reservationId} annulée et supprimée avec succès.`,
            userId: userId
        }
    } catch (error: any) {
        return {
            success: false,
            message: 'Erreur lors de l’annulation de la réservation.',
            error: error.message
        }
    }
}