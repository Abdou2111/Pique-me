import React from "react";
import { StatusBar } from "react-native";
import { Tabs } from "expo-router";

// Icons
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function RootLayout() {
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
                    name="(Home)"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarLabel: "Home",
                        tabBarLabelStyle: { fontSize: 12 },
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="home" size={size} color={color} />
                        ),
                    }}
                />

                {/* SEARCH  */}
                <Tabs.Screen
                    name="Search"
                    options={{
                        title: "Search",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="search" size={size} color={color} />
                        ),
                    }}
                />

                {/* PARKS  */}
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
                />


                {/* PROFILE */}
                <Tabs.Screen
                    name="Profile"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                        tabBarBadge: 3,
                        tabBarBadgeStyle: { backgroundColor: "tomato", color: "white" },
                    }}
                />
            </Tabs>
        </>
    );
}
