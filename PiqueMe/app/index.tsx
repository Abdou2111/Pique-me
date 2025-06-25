import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import firebaseApp from './firebaseConfig';
import parc from "@/app/components/parc";
import parcFavoris from "@/app/components/parcFavoris";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={parc} />
            </Stack.Navigator>
    );
}
