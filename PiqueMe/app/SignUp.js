import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { router } from 'expo-router';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        // TODO: Integrate Firebase auth for sign-up
        console.log("Sign up with:", email, password);

        // Navigate to Login screen after successful sign-up
        router.replace('/LoginScreen');
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Create an Account</Title>

            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />

            <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />

            <Button mode="contained" onPress={handleSignUp} style={styles.button}>
                Sign Up
            </Button>

            <Text
                style={styles.loginText}
                onPress={() => router.replace('/LoginScreen')}
            >
                Already have an account? Log in
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
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
    },
    loginText: {
        marginTop: 24,
        textAlign: 'center',
        color: '#1e90ff',
    },
});