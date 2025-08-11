// app/_layout.tsx
import {Navigator, Stack} from 'expo-router'
import { UserDocProvider } from './context/UserDocContext'
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <UserDocProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </UserDocProvider>
        </GestureHandlerRootView>
    )
}
