// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import {Avatar} from "@rneui/base";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Integrate Firebase auth here
        console.log("Login with:", email, password);
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Pique-me</Title>

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

            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Login
            </Button>

            <Text
                style={styles.signupText}
                onPress={() => navigation.navigate('Signup')}
            >
                Don't have an account? Sign up
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
    signupText: {
        marginTop: 24,
        textAlign: 'center',
        color: '#1e90ff',
    },
});
