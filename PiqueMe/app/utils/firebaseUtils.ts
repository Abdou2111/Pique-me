// app/utils/firebaseUtils.ts
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Fonction locale (pas de cloud function) pour récupérer un parc par son NUM_INDEX.
 */
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
