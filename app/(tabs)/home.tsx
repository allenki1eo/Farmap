import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Bot, MapPin, Search, Settings, Sprout, TrendingUp } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { OfflineIndicator, PrimaryButton } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getCrops, getRegions } from "@/services/api";

const CROP_COLORS: Record<string, string> = {
  Maize: "#F59E0B",
  Rice: "#10B981",
  Avocado: "#1F5E3B",
  Sunflower: "#F59E0B",
  Coffee: "#92400E",
  "Cashew Nuts": "#D97706",
  Moringa: "#059669",
  Vanilla: "#7C3AED",
};

const CROP_EMOJI: Record<string, string> = {
  Maize: "🌽",
  Rice: "🌾",
  Avocado: "🥑",
  Sunflower: "🌻",
  Coffee: "☕",
  "Cashew Nuts": "🥜",
  Moringa: "🌿",
  Vanilla: "🌼",
};

const popular = ["Maize", "Rice", "Avocado", "Sunflower", "Coffee", "Cashew Nuts", "Moringa", "Vanilla"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { data: regions = [] } = useQuery({ queryKey: ["regions"], queryFn: getRegions });
  const { data: crops = [] } = useQuery({ queryKey: ["crops"], queryFn: getCrops });

  const greeting = getGreeting();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingBottom: 112 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with gradient */}
      <LinearGradient colors={["#DDEBDD", colors.cream]} style={{ paddingTop: 54, paddingHorizontal: 18, paddingBottom: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Animated.View entering={FadeInDown.duration(400)} style={{ flex: 1, gap: 4 }}>
            <Text selectable style={{ color: colors.primary, fontSize: 13, fontWeight: "800" }}>KilimoScope AI</Text>
            <Text selectable style={{ color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: "900" }}>{greeting} 👋</Text>
            <Text selectable style={{ color: colors.muted, fontSize: 15, marginTop: 2 }}>What do you want to discover today?</Text>
          </Animated.View>
          <Link href="/settings" asChild>
            <Pressable style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, marginTop: 4 }}>
              <Settings stroke={colors.primary} size={21} />
            </Pressable>
          </Link>
        </View>
        <OfflineIndicator />
      </LinearGradient>

      <View style={{ padding: 18, gap: 20 }}>
        {/* Hero banner */}
        <Animated.View entering={FadeInDown.duration(500).delay(80)}>
          <LinearGradient
            colors={[colors.primary, "#2D7A50", "#1A4D31"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, padding: 24, gap: 14, ...shadows.soft, overflow: "hidden" }}
          >
            {/* Decorative circles */}
            <View style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.06)" }} />
            <View style={{ position: "absolute", right: 30, bottom: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(223,175,55,0.15)" }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
                <TrendingUp stroke={colors.white} size={15} strokeWidth={2.5} />
              </View>
              <Text selectable style={{ color: colors.gold, fontWeight: "900", fontSize: 13 }}>Tanzania Crop Intelligence</Text>
            </View>
            <Text selectable style={{ color: colors.white, fontSize: 26, lineHeight: 32, fontWeight: "900" }}>Know what grows{"\n"}where in Tanzania.</Text>
            <Text selectable style={{ color: "#AEDBC5", lineHeight: 21, fontSize: 14 }}>
              Precision data for farmers, investors, agronomists, and institutions.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" }}>
                <Text selectable style={{ color: colors.white, fontSize: 20, fontWeight: "900" }}>{regions.length || 22}</Text>
                <Text selectable style={{ color: "#AEDBC5", fontSize: 11, fontWeight: "700" }}>Regions</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" }}>
                <Text selectable style={{ color: colors.white, fontSize: 20, fontWeight: "900" }}>185+</Text>
                <Text selectable style={{ color: "#AEDBC5", fontSize: 11, fontWeight: "700" }}>Districts</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" }}>
                <Text selectable style={{ color: colors.white, fontSize: 20, fontWeight: "900" }}>{crops.length > 0 ? `${crops.length}+` : "76+"}</Text>
                <Text selectable style={{ color: "#AEDBC5", fontSize: 11, fontWeight: "700" }}>Crops</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Action cards */}
        <Animated.View entering={FadeInDown.duration(500).delay(160)} style={{ gap: 12 }}>
          <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Quick actions</Text>
          <Link href="/find-area" asChild>
            <Pressable>
              <LinearGradient
                colors={["#EAF7F0", "#D4EDDE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, padding: 20, flexDirection: "row", gap: 16, alignItems: "center", borderWidth: 1, borderColor: "#BDE0CB", ...shadows.card }}
              >
                <View style={{ width: 50, height: 50, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                  <MapPin stroke={colors.white} size={24} strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Crops for my area</Text>
                  <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 3, lineHeight: 19 }}>Select a region or district to see what thrives.</Text>
                </View>
                <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.white, fontSize: 18, fontWeight: "900" }}>→</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Link>
          <Link href="/find-crop" asChild>
            <Pressable>
              <LinearGradient
                colors={["#FFF8E8", "#FFF0C4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, padding: 20, flexDirection: "row", gap: 16, alignItems: "center", borderWidth: 1, borderColor: "#F5D97A", ...shadows.card }}
              >
                <View style={{ width: 50, height: 50, borderRadius: 18, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
                  <Search stroke={colors.white} size={24} strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Best areas for crop</Text>
                  <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 3, lineHeight: 19 }}>Pick a crop and find its top-suited regions.</Text>
                </View>
                <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.white, fontSize: 18, fontWeight: "900" }}>→</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Link>
        </Animated.View>

        {/* Popular crops */}
        <Animated.View entering={FadeInDown.duration(500).delay(240)} style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Popular crop searches</Text>
            <Link href="/(tabs)/crops" asChild>
              <Pressable>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>See all →</Text>
              </Pressable>
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {popular.map((name, i) => {
              const crop = crops.find((item) => item.name === name);
              const accent = CROP_COLORS[name] ?? colors.primary;
              const emoji = CROP_EMOJI[name] ?? "🌱";
              return (
                <Animated.View key={name} entering={FadeInRight.duration(400).delay(i * 50)}>
                  <Link href={crop ? `/crop/${crop.id}` : "/find-crop"} asChild>
                    <Pressable style={{ backgroundColor: colors.white, borderRadius: 20, padding: 16, minWidth: 120, borderWidth: 1, borderColor: colors.line, gap: 8, alignItems: "flex-start", ...shadows.card }}>
                      <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: `${accent}18`, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 22 }}>{emoji}</Text>
                      </View>
                      <Text selectable style={{ color: colors.text, fontWeight: "900", fontSize: 14 }}>{name}</Text>
                    </Pressable>
                  </Link>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Top rated regions */}
        {regions.length > 0 && (
          <Animated.View entering={FadeInDown.duration(500).delay(320)} style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Top rated regions</Text>
              <Link href="/(tabs)/map" asChild>
                <Pressable>
                  <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>Open map →</Text>
                </Pressable>
              </Link>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {[...regions]
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 6)
                .map((region, i) => (
                  <Animated.View key={region.id} entering={FadeInRight.duration(400).delay(i * 60)}>
                    <Link href={`/region/${region.id}` as never} asChild>
                      <Pressable style={{ width: 180, backgroundColor: colors.white, borderRadius: 20, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: region.confidence >= 90 ? colors.primary : region.confidence >= 80 ? colors.blue : colors.gold }} />
                          <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 12 }}>{region.confidence}%</Text>
                        </View>
                        <Text selectable style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>{region.name}</Text>
                        <Text selectable style={{ color: colors.muted, fontSize: 12, lineHeight: 17 }} numberOfLines={2}>{region.climateType}</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                          {region.topCrops.slice(0, 2).map((c) => (
                            <View key={c} style={{ backgroundColor: colors.softGreen, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                              <Text style={{ color: colors.primary, fontSize: 10, fontWeight: "900" }}>{c}</Text>
                            </View>
                          ))}
                        </View>
                      </Pressable>
                    </Link>
                  </Animated.View>
                ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* AI card */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <LinearGradient
            colors={["#1E3A5F", "#1A2E4A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, padding: 22, gap: 14, ...shadows.soft, overflow: "hidden" }}
          >
            <View style={{ position: "absolute", right: -10, top: -10, width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(45,156,219,0.15)" }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(45,156,219,0.2)", alignItems: "center", justifyContent: "center" }}>
                <Bot stroke="#2D9CDB" size={24} />
              </View>
              <View>
                <Text selectable style={{ color: colors.white, fontSize: 18, fontWeight: "900" }}>Ask Kilimo AI</Text>
                <Text selectable style={{ color: "#7AB8D4", fontSize: 12, fontWeight: "700" }}>Powered by crop intelligence</Text>
              </View>
            </View>
            <Text selectable style={{ color: "#A8C8D8", lineHeight: 21, fontSize: 14 }}>
              Ask anything about crops, regions, or farming in English or Kiswahili.
            </Text>
            <Link href="/(tabs)/ask-ai" asChild>
              <Pressable>
                <View style={{ backgroundColor: "#2D9CDB", borderRadius: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Sprout stroke={colors.white} size={18} strokeWidth={2.5} />
                  <Text style={{ color: colors.white, fontWeight: "900", fontSize: 15 }}>Open AI Advisor</Text>
                </View>
              </Pressable>
            </Link>
          </LinearGradient>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
