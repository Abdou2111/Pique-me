// (tabs)/LoginScreen.js
import React, { useState } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import {Avatar} from "@rneui/base";
import {router} from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebaseConfig";
import HorizontalRule from "./components/HorizontalRule";
import GoogleButton from "./components/GoogleButton";
import FacebookButton from "./components/FacebookButton";
import {SafeAreaView} from "react-native-safe-area-context";



export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleGoogleLogin = () => {
        // Implement Google login functionality here
        // This is a placeholder function
        console.log("Google login clicked");
        // You can use Firebase's signInWithPopup or signInWithRedirect for Google authentication
        // Example: signInWithPopup(auth, new GoogleAuthProvider());
        // Note: Ensure you have set up Google authentication in your Firebase console
        // and imported the necessary functions from Firebase.
        setError("Google login functionality is not implemented yet.");
    }

    const handleLogin = () => {
        try {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log("User logged in:", user);
                    // Navigate to Index tab
                    router.replace('/(tabs)/(Home)');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // Handle Errors here.
                    if (errorCode === 'auth/invalid-credential') {
                        setError("Invalid credentials. Please check your email and password.");
                    } else if (errorCode === 'auth/invalid-email') {
                        setError("Invalid email format.");
                    } else {
                        setError(`Sign-in error: ${errorMessage}`);
                    }
                    // You can display an error message to the user here
                });
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            // Handle unexpected errors
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/Logoo.png')} style={styles.logo} />

            <TextInput
                label="Email"
                value={email}
                onChangeText={text => {setEmail(text); setError(null);}}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                theme={{ colors: { primary: 'green', onSurfaceVariant: 'gray' } }}
            />

            <TextInput
                label="Mot de passe"
                value={password}
                onChangeText={text => {setPassword(text); setError(null);}}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                theme={{ colors: { primary: 'green', onSurfaceVariant: 'gray' } }}
            />

            {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>}
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Se connecter
            </Button>

            <Text
                style={styles.signupText}
                onPress={() => router.replace('/signUp/')}
            >
                Pas encore de compte ? Inscrivez-vous
            </Text>
            <HorizontalRule color="#ccc" thickness={1} margin={20} />
            <GoogleButton/>
            <FacebookButton/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F8F7F3',
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 26,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#000000',
        color: "#ffffff",
        borderRadius: 10,
    },
    signupText: {
        marginTop: 24,
        textAlign: 'center',
        color: 'green',
    },
    logo: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginBottom: 10,
    }
});