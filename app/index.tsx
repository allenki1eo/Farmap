import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MapPin, Sparkles, TrendingUp } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { PrimaryButton } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { useAppStore } from "@/stores/app-store";

const FEATURES = [
  { icon: MapPin, color: colors.primary, label: "Real map intelligence", desc: "Live OpenStreetMap with region markers" },
  { icon: Sparkles, color: colors.gold, label: "AI-powered advice", desc: "Ask in English or Kiswahili" },
  { icon: TrendingUp, color: "#2D9CDB", label: "76+ crops tracked", desc: "Suitability scores across 22 regions" },
];

export default function WelcomeScreen() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    if (hasCompletedOnboarding) router.replace("/(tabs)/home");
  }, [hasCompletedOnboarding]);

  return (
    <LinearGradient
      colors={["#1A4D31", "#1F5E3B", "#2D7A50", "#DDEBDD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={{ flex: 1, padding: 24 }}
    >
      {/* Top section */}
      <View style={{ flex: 1, justifyContent: "center", gap: 28 }}>
        <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: "center", gap: 20 }}>
          <View style={{ borderRadius: 36, overflow: "hidden", ...shadows.soft, borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" }}>
            <Image source={require("@/assets/kilimoscope-logo.png")} style={{ width: 120, height: 120 }} />
          </View>
          <View style={{ alignItems: "center", gap: 8 }}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 }}>
              <Text selectable style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "800", letterSpacing: 1.5 }}>TANZANIA CROP INTELLIGENCE</Text>
            </View>
            <Text selectable style={{ color: colors.white, fontSize: 42, lineHeight: 48, fontWeight: "900", textAlign: "center" }}>KilimoScope{"\n"}AI</Text>
            <Text selectable style={{ color: "#AEDBC5", fontSize: 16, fontWeight: "700", textAlign: "center" }}>Know what grows where.</Text>
          </View>
        </Animated.View>

        {/* Feature cards */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={{ gap: 10 }}>
          {FEATURES.map(({ icon: Icon, color, label, desc }, i) => (
            <Animated.View key={label} entering={FadeInUp.duration(400).delay(300 + i * 80)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 18, padding: 14 }}>
                <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: `${color}30`, alignItems: "center", justifyContent: "center" }}>
                  <Icon stroke={color} size={21} strokeWidth={2.3} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text selectable style={{ color: colors.white, fontWeight: "900", fontSize: 15 }}>{label}</Text>
                  <Text selectable style={{ color: "#AEDBC5", fontSize: 12, marginTop: 2 }}>{desc}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View entering={FadeInUp.duration(500).delay(600)} style={{ gap: 14, paddingBottom: 32 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: 18, overflow: "hidden" }}>
          <PrimaryButton label="Get Started" onPress={() => router.push("/language")} />
        </View>
        <Text selectable style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, textAlign: "center" }}>
          For farmers, investors, agronomists &amp; institutions
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
