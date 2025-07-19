// app/_layout.tsx
import { Stack } from 'expo-router';
import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import Header from "./components/Header";


export default function RootLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}