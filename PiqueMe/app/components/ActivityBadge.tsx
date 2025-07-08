// but : badge d'activité avec icône, label et état
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export type Status = 'neutral' | 'bronze' | 'silver' | 'gold';

const statusColors: Record<Status, string> = {
    neutral: '#C8E6C9',  // vert clair par défaut
    bronze:  '#CD7F32',
    silver:  '#C0C0C0',
    gold:    '#FFD700',
};

const selectedColor = '#388E3C'; // vert foncé après click

interface Props {
    iconName: string;
    label: string;
    status: Status;
    onToggle?: (selected: boolean) => void;
}

const ActivityBadge: React.FC<Props> = ({
                                            iconName,
                                            label,
                                            status,
                                            onToggle,
                                        }) => {
    const [selected, setSelected] = useState(false);

    const handlePress = () => {
        const next = !selected;
        setSelected(next);
        onToggle?.(next);
    };

    const bgColor =
        status !== 'neutral'
            ? statusColors[status]
            : selected
                ? selectedColor
                : statusColors['neutral'];

    return (
        <View style={styles.container}>
            <Pressable onPress={handlePress}>
                <View style={[styles.circle, { backgroundColor: bgColor }]}>
                    <FontAwesome5 name={iconName} size={20} color="#000" />
                </View>
            </Pressable>
            <Text
                style={styles.label}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 8,
        width: 100,            // ← largeur fixe pour uniformiser
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#888',
    },
    label: {
        marginTop: 6,
        fontSize: 14,
        textAlign: 'center',   // centrer le texte
        lineHeight: 18,        // ajuster l'espacement des lignes
    },
});

export default ActivityBadge;
