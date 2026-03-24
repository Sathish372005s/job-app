import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { Platform } from "react-native";

export default function RecruiterTabLayout() {
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
                borderTopColor:COLORS.primary,
            },
            sceneStyle: { backgroundColor: COLORS.background }
        }}>
            <Tabs.Screen name="index" options={{ title: "Jobs" ,tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
            )}} />
            <Tabs.Screen name="Applicants" options={{ title: "Applicants" ,tabBarIcon: ({ color }) => (
                <Ionicons name="person-add" size={24} color={color} />
            )}} />
            <Tabs.Screen name="Post-job" options={{ title: "Create" ,tabBarIcon: ({ color }) => (
                <Ionicons name="add" size={24} color={color} />
            )}} />
        </Tabs>
    );
}