import React, { useState } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { router } from 'expo-router';
import {createUserWithEmailAndPassword, GoogleAuthProvider} from "firebase/auth";
import { auth } from '../../firebaseConfig';
import HorizontalRule from "../components/HorizontalRule";
import GoogleButton from "../components/GoogleButton";
import FacebookButton from "../components/FacebookButton";
import {signInWithPopup} from "@react-native-firebase/auth";


export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log("User signed up:", user);
                router.replace('./(tabs)/(Home)'); // Navigate after successful sign-up
            })
            .catch((error) => {
                if(error.code === 'auth/email-already-exists') {
                    setError("This email is already in use.");
                } else if(error.code === 'auth/invalid-email') {
                    setError("Invalid email format.");
                } else {
                    setError(`Sign-up error: ${error.message}`);
                }
            });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/Logoo.png')} style={styles.logo} />

            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                theme={{ colors: { primary: 'green', onSurfaceVariant: 'gray' } }}
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={text => {
                    setPassword(text);
                    setError(null);
                }}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                theme={{ colors: { primary: 'green', onSurfaceVariant: 'gray' } }}
            />

            <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={text => {
                    setConfirmPassword(text);
                    setError(null);
                }}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                theme={{ colors: { primary: 'green', onSurfaceVariant: 'gray' } }}
            />

            {error && <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>}
            <Button mode="contained" onPress={handleSignUp} style={styles.button}>
                Sign Up
            </Button>

            <Text
                style={styles.loginText}
                onPress={() => router.replace('./')}
            >
                Already have an account? Log in
            </Text>

            <HorizontalRule color="#ccc" thickness={1} margin={20} />
            <GoogleButton/>
            <FacebookButton/>

            {/* Uncomment the following line to add a horizontal rule */}
            {/* <HorizontalRule color="#ccc" thickness={1} margin={20} /> */}
        </View>
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
    },
    loginText: {
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