import { Stack } from 'expo-router';

export default function RootLayout() {
    return (<Stack>
        <Stack.Screen name="index" options={{ title: "Parks" }} />
        <Stack.Screen name="PageParc" options={{ title: "Détails du parc" }} />
    </Stack>);
}