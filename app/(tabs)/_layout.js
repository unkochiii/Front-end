import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";

export default function TabsLayout() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!token) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs screenOptions={{ 
            headerShown: false, 
            tabBarActiveTintColor: "#FF6B6B",
            tabBarInactiveTintColor: "#999",
            tabBarStyle: {
                backgroundColor: "#FFFFFF",
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: -5 },
                height: 60,
                paddingBottom: 8,
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: "600",
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cards-heart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="binoculars" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" size={size} color={color} />
                    ),
                }}
            />
            {/* route interne */}
            <Tabs.Screen name="book/[bookKey]" options={{ href: null }} />
        </Tabs>
    );
}
