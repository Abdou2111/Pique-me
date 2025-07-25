// app/_layout.tsx
import { Stack } from 'expo-router'
import { UserDocProvider } from './context/UserDocContext'

export default function RootLayout() {
    return (
        <UserDocProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </UserDocProvider>
    )
}
