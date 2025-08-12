import * as Location from "expo-location";

export type Coords = { latitude: number; longitude: number } | null;

let LAST: Coords = null;

/** Kick this off at app start; resolves fast if the OS has a last fix */
export async function warmLocation() {
    try {
        const last = await Location.getLastKnownPositionAsync();
        if (last) LAST = { latitude: last.coords.latitude, longitude: last.coords.longitude };
    } catch {}
}

export function getLastLocation(): Coords {
    return LAST;
}
