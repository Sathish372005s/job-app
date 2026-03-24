import { Tabs } from "expo-router";
export default function UserTabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Jobs" ,tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
            )}} />
            <Tabs.Screen name="Applications" options={{ title: "Applications" ,tabBarIcon: ({ color }) => (
                <Ionicons name="applications" size={24} color={color} />
            )}} />
            <Tabs.Screen name="Profile" options={{ title: "Profile" ,tabBarIcon: ({ color }) => (
                <Ionicons name="profile" size={24} color={color} />
            )}} />
        </Tabs>
    );
}