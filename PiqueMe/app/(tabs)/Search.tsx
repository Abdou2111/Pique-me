/* app/(tabs)/Search.tsx */

import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as geofire from 'geofire-common';
import * as Location from 'expo-location';
import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import SearchBar from '../components/SearchBar';
import ParcList from '../components/ParcList';

import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { subscribeParksCache, getParksSync, type Park } from "../utils/parcCache";
import { getLastLocation } from "../utils/locationCache";

/* ─── Tags disponibles ── */
const FILTERS = [
  { id: 'aireJeu', label: 'Aire de jeu', icon: 'game-controller' as const },
  { id: 'recreatif', label: 'Récréatif', icon: 'basketball' as const },
  { id: 'pleinAir', label: 'Plein air', icon: 'leaf' as const },
  { id: 'piqueNique', label: 'Pique-nique', icon: 'restaurant' as const },
] as const;

/* mapping installation.TYPE → id de tag */
const toTag = (t: unknown): string | null => {
  const s = (String(t ?? '')).toLowerCase();
  if (s.includes('aire de jeu')) return 'aireJeu';
  if (s.includes('récréatif')) return 'recreatif';
  if (s.includes('plein air')) return 'pleinAir';
  if (s.includes('pique-nique')) return 'piqueNique';
  return null;
};

const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

/* helper: convert Firestore doc → UI model, avec fallback docId si NUM_INDEX absent */
const asPark = (p: DocumentData, fallbackId?: string): Park => ({
  id: String(p.NUM_INDEX ?? fallbackId),
  name: String(p.Nom ?? ''),
  lat: Number(p.centroid?.lat ?? 0),
  lng: Number(p.centroid?.lng ?? 0),
  tags: (p.installations ?? [])
    .map((i: DocumentData) => toTag(i.TYPE))
    .filter(Boolean) as string[],
  filters: (p.installations ?? [])
    .map((i: DocumentData) => toTag(i.TYPE))
    .filter(Boolean) as string[],
});

/* tiny utility – returns parks whose geohash falls in `region` */
async function fetchParksInRegion(region: Region): Promise<Park[]> {
  const center = [region.latitude, region.longitude] as [number, number];
  const radiusM =
    Math.max(region.latitudeDelta, region.longitudeDelta) * 55_000;

  const bounds = geofire.geohashQueryBounds(center, radiusM);
  const snaps = await Promise.all(
    bounds.map(([start, end]) =>
      getDocs(
        query(
          collection(db, 'parks'),
          orderBy('geohash'),
        startAt(start),
          endAt(end),
        ),
      ),
    ),
  );

  return snaps.flatMap((s) => s.docs.map((d) => asPark(d.data(), d.id)));
}

/* merge two arrays without duplicates (by id) */
const mergeById = (oldArr: Park[], newArr: Park[]): Park[] => {
  const map = new Map<string, Park>(oldArr.map((p) => [p.id, p]));
  newArr.forEach((p) => map.set(p.id, p));
  return [...map.values()];
};

/* km → degrees latitude (≈ 111 km ≙ 1 ° lat) */
const km2degLat = (km: number) => km / 111;
/* adjust long delta by cos φ so window looks square */
const km2degLng = (km: number, lat: number) =>
  km / (111 * Math.cos((lat * Math.PI) / 180));

/* bottom-sheet sizing and snap points */
const SCREEN_H = Dimensions.get('window').height;
const SHEET_H = SCREEN_H * 0.85;
const COLLAPSED_H = 59;
const SNAP_TOP = 0;
const SNAP_PEEK = SHEET_H - COLLAPSED_H;

/* ─────────────────────────────────────────────────────────────────────── */
export default function Search() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  /* UI state */
  const [queryText, setQueryText] = useState('');
  const [active, setActive] = useState<Set<string>>(new Set());

  const last = getLastLocation();
  // Montreal default location if no last known position
  const initialRegion = useMemo<Region>(() => {
    const lat = last?.latitude ?? 45.5019;
    const lng = last?.longitude ?? -73.5674;
    const latDelta = km2degLat(last ? 1 : 2);
    const lngDelta = km2degLng(lat ? 1 : 2, lat);
    return { latitude: lat, longitude: lng, latitudeDelta: latDelta, longitudeDelta: lngDelta };
  }, [last]);

  const [region, setRegion] = useState<Region | null>(initialRegion);
  const sameRegion = (a: Region, b: Region) =>
      Math.abs(a.latitude - b.latitude) < 1e-6 &&
      Math.abs(a.longitude - b.longitude) < 1e-6 &&
      Math.abs(a.latitudeDelta - b.latitudeDelta) < 1e-6 &&
      Math.abs(a.longitudeDelta - b.longitudeDelta) < 1e-6;
  /* data state */
  const [parks, setParks] = useState<Park[]>(() => getParksSync());

  // @ts-ignore
  useEffect(() => {
    const unsub = subscribeParksCache((p) => setParks(p));
    return unsub;
  }, []);

  /* update location in background */
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('permission denied');

        const { coords } = await Location.getCurrentPositionAsync({});
        const latDelta = km2degLat(1);
        const lngDelta = km2degLng(1, coords.latitude);
        const reg: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        };
        // smooth camera move without blocking first paint
        mapRef.current?.animateToRegion(reg, 400)
        setRegion(reg);
      } catch {}
    })();
  }, []);

  /* staged fetch: viewport first, full dump after first frame */
  useEffect(() => {
    if (!region) return;
    const load = async () => {
      const initial = await fetchParksInRegion(region);
      setParks(initial);

      InteractionManager.runAfterInteractions(async () => {
        const snap = await getDocs(collection(db, 'parks'));
        const all = snap.docs.map((d) => asPark(d.data(), d.id));
        setParks((prev) => mergeById(prev, all));
      });
    };
    load();
  }, [region]);

  /* helper – inside viewport? */
  const inside = useCallback((p: Park, r: Region | null): boolean => {
    if (!r) return false;
    const halfLat = r.latitudeDelta / 2;
    const halfLng = r.longitudeDelta / 2;
    return (
      p.lat >= r.latitude - halfLat &&
      p.lat <= r.latitude + halfLat &&
      p.lng >= r.longitude - halfLng &&
      p.lng <= r.longitude + halfLng
    );
  }, []);

  /* helper: returns best match by name from list */
  const bestMatchByName = (q: string, list: Park[]): Park | null => {
    const Q = norm(q);
    return (
        list.find(p => norm(p.name) === Q) ||         // exact
        list.find(p => norm(p.name).startsWith(Q)) || // prefix
        list.find(p => norm(p.name).includes(Q)) ||   // contains
        null
    );
  };

  const centerOnPark = (p: Park) => {
    const next: Region = {
      latitude: p.lat,
      longitude: p.lng,
      latitudeDelta: km2degLat(1),
      longitudeDelta: km2degLng(1, p.lat),
    };
    mapRef.current?.animateToRegion(next, 400);
    setRegion(next); // keep state in sync
  };
  // centers on the best match or the current query
  const focusOnQuery = (text?: string) => {
    const q = (text ?? queryText).trim();
    if (!q) return;

    // respect active tag filters if any
    const eligible = parks.filter(p =>
        ![...active].length || [...active].every(t => p.tags.includes(t))
    );

    const match = bestMatchByName(q, eligible);
    if (match) centerOnPark(match);
  };
  /* Automatically center on park if query matches exactly */
  useEffect(() => {
    const q = queryText.trim();
    if (!q) return;
    const exact = parks.find(p => norm(p.name) === norm(q));
    if (exact && !inside(exact, region)) {
      centerOnPark(exact);
    }
  }, [queryText, parks, region, active]);

  /* filtered list for markers + bottom sheet */
  const shown = useMemo(
    () =>
      parks.filter(
        (p) =>
          inside(p, region) &&
          (!queryText || norm(p.name).includes(norm(queryText))) &&
          (![...active].length || [...active].every((t) => p.tags.includes(t))),
      ),
    [parks, region, queryText, active, inside],
  );

  const toggle = (id: string) => {
    const n = new Set(active);
    n.has(id) ? n.delete(id) : n.add(id);
    setActive(n);
  };

  /* ---------- bottom-sheet behaviour (FLING) ---------------------------- */
  const y = useSharedValue<number>(SNAP_PEEK);

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      y.value = withSpring(SNAP_TOP, {});
    });

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      y.value = withSpring(SNAP_PEEK, {});
    });

  const sheetGesture = Gesture.Simultaneous(flingUp, flingDown);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  /* --------------------------- UI -------------------------------------- */
  return (
    <SafeAreaView style={S.flex}>
      {region && (
        <MapView
            ref={mapRef}
            style={S.map}
            initialRegion={initialRegion}
            onRegionChangeComplete={(r) => {
              if (!sameRegion(r, region)) setRegion(r);
            }}
            showsUserLocation
            showsMyLocationButton
            moveOnMarkerPress={false}
        >
          {shown.map((p, i) => (
            <Marker
              key={`${p.id}-${i}`}
              coordinate={{ latitude: p.lat, longitude: p.lng }}
              title={p.name}
            />
          ))}
        </MapView>
      )}

      {/* search bar + chips */}
      <View style={[S.topOverlay, { top: insets.top + 8 }]}>
        <SearchBar
          value={queryText}
          onChange={setQueryText}
          placeholder="Rechercher des parcs…"
          onSubmit={focusOnQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.tagRow}
        >
          {FILTERS.map((t) => {
            const on = active.has(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggle(t.id)}
                style={[S.chip, on && S.chipOn]}
              >
                <Ionicons
                  name={on ? t.icon : (`${t.icon}-outline` as any)}
                  size={16}
                  color={on ? '#fff' : '#444'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[S.txt, on && S.txtOn]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* draggable bottom sheet */}
      <GestureDetector gesture={sheetGesture}>
        <Animated.View style={[S.listPanel, sheetStyle]}>
          <View style={S.header}>
            <View style={S.handle} />
            <Text style={S.title}>{shown.length} Résultats</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
            <ParcList
              parks={shown}
              filterQuery={norm(queryText)}
              filterTags={[...active]}
              useFavorisCard
            />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

/* ── styles ── */
const S = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  map: StyleSheet.absoluteFillObject,

  topOverlay: { position: 'absolute', width: '100%', paddingHorizontal: 12 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipOn: { backgroundColor: '#0f6930' },

  txt: { fontSize: 12, color: '#444' },
  txtOn: { color: '#fff', fontWeight: '600' },

  listPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    height: SHEET_H,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  header: { alignItems: 'center', paddingTop: 6 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0003',
    marginBottom: 6,
  },
  title: { fontWeight: '600', fontSize: 16 },
});
