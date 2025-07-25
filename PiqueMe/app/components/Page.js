import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from './Header';

export default function Page({ title, children }) {
    return (
        <SafeAreaView style={S.root}>
            <Header title={title} />
            {children}
        </SafeAreaView>
    );
}

const S = StyleSheet.create({ root:{ flex:1, backgroundColor:'#fff' } });
