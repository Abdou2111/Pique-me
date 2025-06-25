import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import Index from '../(tabs)/Parks';
import Profile from '../(tabs)/Profile';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Parks') iconName = 'park';
                    else if (route.name === 'Profile') iconName = 'person';

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'green',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Parks" component={Index} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
