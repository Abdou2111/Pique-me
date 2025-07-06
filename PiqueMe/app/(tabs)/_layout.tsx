import { Tabs } from "expo-router";
import {StatusBar} from "react-native";
import React from "react";

//Icons
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootLayout() {
    return (
        <React.Fragment>
            <StatusBar barStyle="light-content" />
            <Tabs screenOptions={
                {tabBarActiveTintColor: "yellow", tabBarInactiveTintColor: "black", tabBarStyle: {
                        backgroundColor: "#009688",
                        borderTopColor: "#eee",
                    },}
            }>
                <Tabs.Screen name="(Home)" options={{
                    title: "Home",
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarLabelStyle: {fontSize: 12},
                    tabBarIcon: ({color, size}) => (
                            <MaterialIcons name="home" size={size} color={color} />
                        )
                }}/>
                <Tabs.Screen name="Search" options={{
                    title: "Seearch",
                    tabBarIcon: ({color, size}) => (
                            <FontAwesome name="search" size={size} color={color} />
                        )
                }}/>
                <Tabs.Screen name="Parks" options={{
                    title: "Parks",
                    headerShown: false,
                    tabBarLabel: "Parks",
                    tabBarLabelStyle: {fontSize: 12},
                    tabBarIcon: ({color, size}) => (
                            <MaterialIcons name="park" size={size} color={color} />
                        )
                }}/>
                <Tabs.Screen name="Profile" options={{
                    title: "Profile",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="person" size={size} color={color} />
                        ),
                    tabBarBadge: 3,
                    tabBarBadgeStyle: {backgroundColor: 'tomato', color: 'white'}
                }}/>
            </Tabs>
        </React.Fragment>
    )
}

