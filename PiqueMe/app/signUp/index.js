import React, { useState } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { router } from 'expo-router';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from '../../firebaseConfig';
import HorizontalRule from "../components/HorizontalRule";
import GoogleButton from "../components/GoogleButton";
import FacebookButton from "../components/FacebookButton";
import { ensureUserDoc } from '../utils/firebaseUtils'


export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed up
                const user = userCredential.user;
                await ensureUserDoc(user.uid)
                router.replace('./(tabs)/Home')
                console.log("User signed up:", user);
                router.replace('./(tabs)/Home'); // Navigate after successful sign-up
            })
            .catch((error) => {
                if(error.code === 'auth/email-already-exists') {
                    setError("Courriel déjà utilisé.");
                } else if(error.code === 'auth/invalid-email') {
                    setError("Email invalide.");
                } else {
                    setError(`Erreur d'inscription: ${error.message}`);
                }
            });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/Logoo.png')} style={styles.logo} resizeMode="contain" />

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
                label="Mot de passe"
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
                label="Confirmer le mot de passe"
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
                S'inscrire
            </Button>

            <Text
                style={styles.loginText}
                onPress={() => router.replace('./')}
            >
                Vous avez déjà un compte ? Connectez-vous
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