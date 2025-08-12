import { collection, onSnapshot, type DocumentData } from "firebase/firestore";
import { db } from "../../firebaseConfig";

/* Keep this Park type aligned with your app */
export type Park = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    tags: string[];
    filters: string[];
};

const toTag = (t: unknown): string | null => {
    const s = (String(t ?? "")).toLowerCase();
    if (s.includes("aire de jeu")) return "aireJeu";
    if (s.includes("récréatif")) return "recreatif";
    if (s.includes("plein air")) return "pleinAir";
    if (s.includes("pique-nique")) return "piqueNique";
    return null;
};

const asPark = (p: DocumentData, fallbackId?: string): Park => ({
    id: String(p.NUM_INDEX ?? fallbackId),
    name: String(p.Nom ?? ""),
    lat: Number(p.centroid?.lat ?? 0),
    lng: Number(p.centroid?.lng ?? 0),
    tags: (p.installations ?? []).map((i: DocumentData) => toTag(i.TYPE)).filter(Boolean) as string[],
    filters: (p.installations ?? []).map((i: DocumentData) => toTag(i.TYPE)).filter(Boolean) as string[],
});

let CACHE: Park[] = [];
let SUBBED = false;
const listeners = new Set<(parks: Park[]) => void>();

export function warmParks() {
    if (SUBBED) return;
    SUBBED = true;
    onSnapshot(collection(db, "parks"), (snap) => {
        CACHE = snap.docs.map((d) => asPark(d.data(), d.id));
        listeners.forEach((cb) => cb(CACHE));
    });
}

export function getParksSync(): Park[] {
    return CACHE;
}

export function subscribeParksCache(cb: (parks: Park[]) => void) {
    listeners.add(cb);
    // give whatever we already have immediately
    if (CACHE.length) cb(CACHE);
    return () => listeners.delete(cb);
}
