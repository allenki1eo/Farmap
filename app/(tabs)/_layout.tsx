import { Tabs } from "expo-router";
import { Bookmark, Bot, Home, Map, Sprout } from "lucide-react-native";
import { colors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9BABA0",
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
          shadowColor: "#17231A",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: { fontWeight: "800", fontSize: 11, marginTop: 2 },
        tabBarItemStyle: { gap: 2 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home stroke={color} size={22} fill={focused ? `${colors.primary}20` : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <Map stroke={color} size={22} fill={focused ? `${colors.primary}20` : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: "Crops",
          tabBarIcon: ({ color, focused }) => (
            <Sprout stroke={color} size={22} fill={focused ? `${colors.primary}20` : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="ask-ai"
        options={{
          title: "Ask AI",
          tabBarIcon: ({ color, focused }) => (
            <Bot stroke={color} size={22} fill={focused ? `${colors.primary}20` : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <Bookmark stroke={color} size={22} fill={focused ? `${colors.primary}20` : "transparent"} />
          ),
        }}
      />
    </Tabs>
  );
}
