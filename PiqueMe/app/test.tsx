import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Pressable,
    Text,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import ActivityBadge, { Status } from './components/ActivityBadge';
import { parkActivities }        from './components/Activity';

/* quelle couleur pour chaque index ? */
const level = (i: number): Status =>
    i === 0 ? 'gold'   :
        i === 1 ? 'silver' :
            i === 2 ? 'bronze' : 'neutral';

export default function TestScreen() {
    /* mémorise les badges neutres cliqués (verts foncés) */
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggle = (id: string, sel: boolean) =>
        setSelected(prev => {
            const n = new Set(prev);
            sel ? n.add(id) : n.delete(id);
            return n;
        });

    return (
        <SafeAreaView style={styles.flex}>
            <ScrollView contentContainerStyle={styles.grid}>
                {parkActivities.map((act, idx) => (
                    <ActivityBadge
                        key={act.id}
                        iconName={act.icon}
                        label={act.title}
                        status={level(idx)}
                        onToggle={sel => toggle(act.id, sel)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#fff' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 16,
    },
});
