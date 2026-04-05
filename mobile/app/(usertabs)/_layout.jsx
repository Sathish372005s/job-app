import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { Platform } from "react-native";

export default function UserTabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textSecondary,
            tabBarStyle: {
                backgroundColor: COLORS.background,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                height: Platform.OS === 'ios' ? 85 : 80,
                paddingTop: 10,
            },
            sceneStyle: { backgroundColor: COLORS.background }
        }}>
            <Tabs.Screen name="index" options={{
                title: "Jobs", tabBarIcon: ({ color }) => (
                    <Ionicons name="home" size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="Applications" options={{
                title: "Applications", tabBarIcon: ({ color }) => (
                    <Ionicons name="document-text" size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="Profile" options={{
                title: "Profile", tabBarIcon: ({ color }) => (
                    <Ionicons name="person" size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="applyforjob" options={{
                href: null,
                title: "Apply for Job"
            }} />
        </Tabs>
    );
}