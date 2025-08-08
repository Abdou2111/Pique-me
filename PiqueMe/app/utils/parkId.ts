// Renvoie l'ID "court" unique d'un parc (NUM_INDEX si dispo, sinon doc.id)
export function getStableParkId(data: any, fallback: string): string {
    const v = data?.NUM_INDEX ?? data?.num_index ?? data?.code ?? data?.id;
    return String(v ?? fallback);
}
