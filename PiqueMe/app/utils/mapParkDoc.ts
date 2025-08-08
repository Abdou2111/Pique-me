import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { getStableParkId } from './parkId';

export type Park = {
    id: string;          // ← NUM_INDEX (ou doc.id si pas de NUM_INDEX)
    name: string;
    imageUri: string;
    docId?: string;
};

export function mapParkDoc(d: QueryDocumentSnapshot<DocumentData>): Park {
    const data = d.data();
    return {
        id: getStableParkId(data, d.id),
        docId: d.id,
        name: (data.Nom as string) || 'Parc',
        imageUri: 'https://via.placeholder.com/400x200',
    };
}
