import React from 'react';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Text} from "react-native";
import {FacebookAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../firebaseConfig";
import {router} from "expo-router";


export default function FacebookButton() {

    const handleFacebookLogin = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);

                // ...
            });
    }

    return (
        <Button
            onPress={handleFacebookLogin}
            style={{
                marginTop: 12,
                backgroundColor: '#ffffff',
                color: '#000000',
                borderWidth: 2,
                borderColor: '#E5E7EB',
                borderRadius: 10,
            }}
            icon={({ size}) => (
                <MaterialCommunityIcons name="facebook" size={size} color={'#000000'} />
            )}
        >
            <Text style={{ color: '#000000' }}>Se connecter avec Facebook</Text>
        </Button>
    );
}