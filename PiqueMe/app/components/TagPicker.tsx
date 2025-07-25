import React, { useState } from 'react';
import {
    View, StyleSheet, Text, ScrollView, Pressable, Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* ────────────────────
   1)  Type utilitaire = union de TOUTES les icônes Ionicons.
   ──────────────────── */
type IconName = keyof typeof Ionicons.glyphMap;

/* ────────────────────
   2)  Tableau des tags.
       Chaque entrée a un id + un libellé + le nom de l’icône (IconName).
   ──────────────────── */
const FILTERS: { id:string; label:string; icon:IconName; iconOutline:IconName }[] = [
    { id:'aireJeu',    label:'Aire de jeu',  icon:'game-controller',  iconOutline:'game-controller-outline' },
    { id:'recreatif',  label:'Récréatif',    icon:'basketball',       iconOutline:'basketball-outline'      },
    { id:'pleinAir',   label:'Plein air',    icon:'leaf',             iconOutline:'leaf-outline'            },
    { id:'piqueNique', label:'Pique‑nique',  icon:'restaurant',       iconOutline:'restaurant-outline'      },
];

/* ────────────────────
   3)  Composant principal.
   ──────────────────── */
export default function TagPicker({
                                      initial,
                                      onCancel,
                                      onSave,
                                  }: {
    initial: string[];
    onCancel: () => void;
    onSave: (tags: string[]) => void;
}) {
    const [sel, setSel] = useState<Set<string>>(new Set(initial));

    const toggle = (id: string) => {
        const next = new Set(sel);
        next.has(id) ? next.delete(id) : next.add(id);
        setSel(next);
    };

    return (
        <View style={S.backdrop}>
            <View style={S.card}>
                <Text style={S.title}>Choisissez vos préférences</Text>

                <ScrollView
                    horizontal
                    contentContainerStyle={S.row}
                    showsHorizontalScrollIndicator={false}
                >
                    {FILTERS.map(t => {
                        const on = sel.has(t.id);
                        return (
                            <Pressable
                                key={t.id}
                                style={[S.chip, on && S.chipOn]}
                                onPress={() => toggle(t.id)}
                            >
                                <Ionicons
                                    name={on ? t.icon : t.iconOutline}
                                    size={16}
                                    color={on ? '#fff' : '#444'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[S.txt, on && S.txtOn]}>{t.label}</Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                <View style={S.btnRow}>
                    <Button title="Annuler"  onPress={onCancel} />
                    <Button title="OK"       onPress={() => onSave([...sel])} />
                </View>
            </View>
        </View>
    );
}

/* ────────────────────
   4)  Styles
   ──────────────────── */
const S = StyleSheet.create({
    backdrop:{ position:'absolute', top:0,left:0,right:0,bottom:0,
        backgroundColor:'#0006', justifyContent:'center', alignItems:'center' },
    card:{ backgroundColor:'#fff', padding:20, borderRadius:12, width:'88%' },
    title:{ fontSize:16, fontWeight:'700', marginBottom:12 },

    row:{ flexDirection:'row', alignItems:'center', marginBottom:16 },

    chip:{ flexDirection:'row', alignItems:'center',
        backgroundColor:'#f0f0f0', borderRadius:22,
        paddingHorizontal:12, paddingVertical:6, marginRight:8 },
    chipOn:{ backgroundColor:'#0f6930' },

    txt:{ fontSize:12, color:'#444' },
    txtOn:{ color:'#fff', fontWeight:'600' },

    btnRow:{ flexDirection:'row', justifyContent:'flex-end' },
});
