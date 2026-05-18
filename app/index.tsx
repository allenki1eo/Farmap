import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MapPin, Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { colors, radii, shadows } from "@/constants/theme";
import { PrimaryButton } from "@/components/ui";
import { useAppStore } from "@/stores/app-store";

export default function WelcomeScreen() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    if (hasCompletedOnboarding) router.replace("/(tabs)/home");
  }, [hasCompletedOnboarding]);

  return (
    <LinearGradient colors={["#F7F3E8", "#DDEBDD", "#FFFFFF"]} style={{ flex: 1, padding: 22, justifyContent: "center", gap: 28 }}>
      <View style={{ alignItems: "center", gap: 18 }}>
        <View style={{ borderRadius: 36, overflow: "hidden", ...shadows.soft }}>
          <Image source={require("@/assets/kilimoscope-logo.png")} style={{ width: 132, height: 132 }} />
        </View>
        <View style={{ alignItems: "center", gap: 10 }}>
          <Text selectable style={{ color: colors.text, fontSize: 38, lineHeight: 42, fontWeight: "900", textAlign: "center" }}>KilimoScope AI</Text>
          <Text selectable style={{ color: colors.primary, fontSize: 17, fontWeight: "900", textAlign: "center" }}>Know what grows where in Tanzania.</Text>
        </View>
      </View>
      <View style={{ backgroundColor: "rgba(255,255,255,0.82)", borderRadius: radii.xl, padding: 22, gap: 16, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <MapPin stroke={colors.primary} size={25} />
          <Sparkles stroke={colors.gold} size={25} />
        </View>
        <Text selectable style={{ color: colors.text, fontSize: 22, lineHeight: 29, fontWeight: "900" }}>Discover the best crops, fruits, spices, and herbs for every region using climate, soil, rainfall, altitude, and AI-powered agricultural intelligence.</Text>
        <Text selectable style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>Built for farmers, investors, agronomists, and institutions.</Text>
      </View>
      <PrimaryButton label="Get Started" onPress={() => router.push("/language")} />
    </LinearGradient>
  );
}

