/**
 * Fetches the “espace_vert.json” GeoJSON via CKAN’s signed download URL,
 * keeps only features whose properties.Type === "Parc",
 * and upserts them into Firestore.
 *
 *   node fetchParks.js
 */

const admin = require("firebase-admin");
let   fetch;               // poly-fetch for Node < 18
if (typeof global.fetch === "function") {
    fetch = global.fetch;
} else {
    fetch = (...a) => import("node-fetch").then(({ default: f }) => f(...a));
}

// ─── Firebase Admin ────────────────────────────────────────────────────────
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ─── CKAN constants ────────────────────────────────────────────────────────
const PARKS_RESOURCE_ID = "35796624-15df-4503-a569-797665f8768e";
const INST_RESOURCE_ID  = "2dac229f-6089-4cb7-ab0b-eadc6a147d5d";
const CKAN_BASE   = "https://donnees.montreal.ca/api/3/action";

const MIN_SUPERFICIE = 5; // (hectares)

// ─── Helpers ───────────────────────────────────────────────────────────────
async function getSignedGeojsonUrl(resourceId) {
    const metaUrl = `${CKAN_BASE}/resource_show?id=${resourceId}`;
    const resMeta = await fetch(metaUrl);
    const meta    = await resMeta.json();

    if (!meta.success) {
        throw new Error(`resource_show failed for ${resourceId}`);
    }
    // CKAN stores the public download URL in result.url
    let url = meta.result.url;

    // Ensure ?alt=media is present (needed for raw file download)
    if (!/alt=media/.test(url)) {
        url += (url.includes("?") ? "&" : "?") + "alt=media";
    }
    return url;
}

async function downloadGeojson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} while fetching GeoJSON`);
    }
    return res.json(); // ⇒ FeatureCollection
}

function filterParcFeatures(fc) {
    return fc.features.filter(
        (f) => {
            const p = f?.properties;
            if (!p) return false;
            const isParc  = typeof p.Type === "string" && /parc/i.test(p.Type);
            const area  = Number(p.SUPERFICIE);
            const bigEnough = !Number.isNaN(area) && area >= MIN_SUPERFICIE;
            return isParc && bigEnough;
        }
    );
}

// ---------- helper: quick centroid for Polygon / MultiPolygon -------------
function centroidOf(feature) {
    try {
        if (feature.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates;
            return { lat, lng };
        }
        const coords =
            feature.geometry.type === "Polygon"
                ? feature.geometry.coordinates[0]      // outer ring
                : feature.geometry.coordinates[0][0];  // first poly of multipoly

        const [sumX, sumY] = coords.reduce(
            ([sx, sy], [x, y]) => [sx + x, sy + y],
            [0, 0]
        );
        const n = coords.length;
        return { lat: sumY / n, lng: sumX / n };   // Firestore-friendly GeoPoint-like
    } catch {
        return null;
    }
}

// ---------- saveToFirestore now strips geometry ---------------------------
async function saveToFirestore(features) {
    let batch = db.batch();
    let count = 0;

    for (const feat of features) {
        const id = String(feat.properties.OBJECTID);
        const data = {
            ...feat.properties,           // all descriptive fields
            installations: feat.installations ?? [],
            centroid: centroidOf(feat),   // small helper field
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        batch.set(db.collection("parks").doc(id), data, { merge: true });
        count++;

        if (count === 500) {           // commit every 500 writes
            await batch.commit();
            batch = db.batch();
            count = 0;
        }
    }
    if (count) await batch.commit();
}

function buildInstLookup(instFC) {
    const lookup = {};
    instFC.features.forEach((f) => {
        const idx = f.properties?.INDEX_PARC;
        if (!idx) return;
        const lite = { ...f.properties, centroid: centroidOf(f) };
        (lookup[idx] ||= []).push(lite);
    });
    return lookup;
}

// ─── Main ──────────────────────────────────────────────────────────────────
(async () => {
    try {
        //console.log("Getting signed download URL from CKAN…");
        const parcUrl = await getSignedGeojsonUrl(PARKS_RESOURCE_ID);
        const instUrl  = await getSignedGeojsonUrl(INST_RESOURCE_ID);

        //console.log("Downloading GeoJSON…");
        const parcs = await downloadGeojson(parcUrl);
        const inst  = await downloadGeojson(instUrl);

        //console.log("Filtering Type = \"Parc\" …");
        const parcFeatures = filterParcFeatures(parcs);
        console.log(`${parcFeatures.length} parcs trouve.`);

        const instByIndex = buildInstLookup(inst);
        /* 3️⃣  Attach installations to their park by NUM_INDEX */
        const joined = parcFeatures.map((f) => ({
            ...f,
            installations: instByIndex[f.properties.NUM_INDEX] ?? [],
        }));

        /*console.log(
            "First 5 parcs:\n",
            JSON.stringify(parcFeatures.slice(0, 5), null, 2)
        );*/

        //console.log("Writing to Firestore…");
        /*console.log(
            JSON.stringify(joined.slice(0, 1), null, 2)
        );*/
        await saveToFirestore(joined);



        console.log("Import finished.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
