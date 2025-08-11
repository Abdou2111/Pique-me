import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { Tabs, router} from "expo-router";
import {useSheet} from "@/app/stores/useSheet";

// Icons
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function RootLayout() {

    const { expand, collapse } = useSheet();
    return (
        <>
            <StatusBar barStyle="light-content" />
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "yellow",
                    tabBarInactiveTintColor: "black",
                    tabBarStyle: {
                        backgroundColor: "#009688",
                        borderTopColor: "#eee",
                    },
                }}
            >
                {/* HOME */}
                <Tabs.Screen
                    name="Home"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="home" size={size} color={color} />
                        ),
                    }}
                />

                {/* SEARCH */}
                <Tabs.Screen
                    name="Search"
                    options={{
                        title: "Search",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="search" size={size} color={color} />
                        ),
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();        // stay on the same component
                            collapse();                // collapse the sheet
                            router.navigate("/Search"); // navigate to Search
                        },
                    }}
                />

                {/* PARKS */}
                <Tabs.Screen
                    name="Parks"
                    options={{
                        title: "Parks",
                        headerShown: false,
                        tabBarLabel: "Parks",
                        tabBarLabelStyle: { fontSize: 12 },
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="park" size={size} color={color} />
                        ),
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                            expand();
                            router.navigate("/Parks");
                        },
                    }}
                />

                {/* PROFILE */}
                <Tabs.Screen
                    name="Profile"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        )
                    }}
                />
            </Tabs>
        </>
    );
}
