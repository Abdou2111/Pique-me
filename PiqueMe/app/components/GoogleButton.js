import React from 'react';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Text} from "react-native";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../firebaseConfig";
import {router} from "expo-router"; // or use 'FontAwesome' for Google

export default function GoogleButton() {

    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("Google user signed in:", user);
                router.replace('/(tabs)/(Home)'); // Navigate to Home tab
            }).catch((error) => {
            console.error("Google sign-in error:", error);
        });
    }

    return (
        <Button
            onPress={handleGoogleLogin}
            style={{
                marginTop: 12,
                backgroundColor: '#ffffff',
                color: '#000000',
                borderWidth: 2,
                borderColor: '#E5E7EB',
                borderRadius: 10,
            }}
            icon={({ size, color }) => (
                <MaterialCommunityIcons name="google" size={size} color={'#000000'} />
            )}
        >
            <Text style={{ color: '#000000' }}>Se connecter avec Google</Text>
        </Button>
    );
}