import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function HorizontalRule({ color = '#ccc', thickness = 1, margin = 12 }) {
    return (
        <View
            style={{
                borderBottomColor: color,
                borderBottomWidth: thickness,
                marginVertical: margin,
            }}
        />
    );
}