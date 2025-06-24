import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import firebaseApp from './firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
    );
}
