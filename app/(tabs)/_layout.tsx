import { Tabs } from "expo-router";
import { Bookmark, Bot, Home, Map, Sprout } from "lucide-react-native";
import { colors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          height: 72,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontWeight: "800", fontSize: 11 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ color }) => <Home stroke={color} size={22} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ color }) => <Map stroke={color} size={22} /> }} />
      <Tabs.Screen name="crops" options={{ title: "Crops", tabBarIcon: ({ color }) => <Sprout stroke={color} size={22} /> }} />
      <Tabs.Screen name="ask-ai" options={{ title: "Ask AI", tabBarIcon: ({ color }) => <Bot stroke={color} size={22} /> }} />
      <Tabs.Screen name="saved" options={{ title: "Saved", tabBarIcon: ({ color }) => <Bookmark stroke={color} size={22} /> }} />
    </Tabs>
  );
}

