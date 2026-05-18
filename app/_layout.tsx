import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/theme";
import { useAppStore } from "@/stores/app-store";
import { useSavedStore } from "@/stores/saved-store";
import { useSearchStore } from "@/stores/search-store";

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const hydrateApp = useAppStore((state) => state.hydrate);
  const hydrateSaved = useSavedStore((state) => state.hydrate);
  const hydrateSearch = useSearchStore((state) => state.hydrate);

  useEffect(() => {
    hydrateApp();
    hydrateSaved();
    hydrateSearch();
  }, [hydrateApp, hydrateSaved, hydrateSearch]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: "900" }, contentStyle: { backgroundColor: colors.cream } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="language" options={{ title: "Language" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="find-area" options={{ title: "Find crops" }} />
          <Stack.Screen name="find-crop" options={{ title: "Search crop" }} />
          <Stack.Screen name="crop/[id]" options={{ title: "Crop profile" }} />
          <Stack.Screen name="region/[id]" options={{ title: "Area profile" }} />
          <Stack.Screen name="reports" options={{ title: "Reports" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

