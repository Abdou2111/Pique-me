import { Stack } from 'expo-router';

export default function RootLayout() {
    return (<Stack>
        <Stack.Screen name="index" options={{ title: "Parks", headerShown: false }} />
        <Stack.Screen name="PageParc" options={{ title: "Détails du parc", headerShown: false }} />
        <Stack.Screen name="Reservation" options={{ title: "Réservation", headerShown: false }} />
        <Stack.Screen name="Reservation2" options={{ title: "Réservation2", headerShown: false }} />
        <Stack.Screen name="AllReservation" options={{ title: "AllReservation", headerShown: false }} />
    </Stack>);
}