import { parkActivities } from '../../../components/Activity';

/**
 * Convertit un nom d'installation (API MTL) en un identifiant de parkActivities
 */
export function normalizeInstallationName(name) {
    const n = name?.toLowerCase() ?? '';
    console.log("🔎 Tentative de mapping pour :", n);


    // Sports collectifs
    if (n.includes('soccer')) return 'soccer';
    if (n.includes('basket')) return 'basketball';
    if (n.includes('volleyball')) return 'volleyball';
    if (n.includes('tennis')) return 'tennis';
    if (n.includes('baseball') || n.includes('softball')) return 'basketball'; // pas de baseball mais fallback

    // Activités de plein air
    if (n.includes('course')) return 'jogging';
    if (/pique(-| )?nique/.test(n)) return 'picnic';
    if (n.includes('yoga')) return 'yoga';
    if (n.includes('tai') && n.includes('chi')) return 'tai-chi';
    if (n.includes('vélo') || n.includes('velo') || n.includes('bicyc')) return 'cycling';
    if (n.includes('randonne') || n.includes('sentier')) return 'hiking';
    if (n.includes('chien') || n.includes('dog')) return 'dog-walk';
    if (n.includes('oiseau') || n.includes('bird')) return 'birdwatching';
    if (n.includes('photo') || n.includes('appareil')) return 'photography';
    if (n.includes('lecture') || n.includes('book')) return 'reading';

    // Eau
    if (n.includes('natation') || n.includes('piscine')) return 'swimming';
    if (n.includes('kayak') || n.includes('canoë') || n.includes('canoe')) return 'kayaking';
    if (n.includes('pêche') || n.includes('peche')) return 'fishing';

    // Jeux et loisirs
    if (n.includes('frisbee') || n.includes('disc-golf')) return n.includes('disc') ? 'frisbee-golf' : 'frisbee';
    if (n.includes('aire') || n.includes('jeux')) return 'playground';
    if (n.includes('skate')) return 'skateboard';
    if (n.includes('roller') || n.includes('patin') || n.includes('patinoire')) return 'rollerblading';
    if (n.includes('boxe') || n.includes('boxing')) return 'boxing';
    if (n.includes('méditation') || n.includes('meditation')) return 'meditation';
    if (n.includes('danse') || n.includes('music')) return 'dance';

    if (n.includes('barbecue') || n.includes('bbq') || n.includes('feu')) return 'barbecue';

    return null; // aucun mapping trouvé
}

/**
 * Transforme la liste raw des installations en list d'activités uniques basées sur parkActivities
 */
export function mapInstallationsToActivities(installations) {
    if (!Array.isArray(installations)) return [];
    const seen = new Set();
    return installations
        .map(inst => normalizeInstallationName(inst.NOM || inst.nom || ''))
        .filter(id => id && !seen.has(id) && seen.add(id))
        .map(id => parkActivities.find(act => act.id === id))
        .filter(Boolean);
}
