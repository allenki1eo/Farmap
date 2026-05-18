import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Bot, Leaf, MapPin, Search, Settings, Sprout } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ActionCard, AppHeader, OfflineIndicator, PrimaryButton, Screen, SectionHeader, StatCard } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getCrops, getRegions } from "@/services/api";

export default function HomeScreen() {
  const { data: regions = [] } = useQuery({ queryKey: ["regions"], queryFn: getRegions });
  const { data: crops = [] } = useQuery({ queryKey: ["crops"], queryFn: getCrops });
  const popular = ["Maize", "Rice", "Avocado", "Sunflower", "Coffee", "Cashew Nuts", "Moringa", "Vanilla"];

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppHeader title="Good morning" subtitle="What do you want to discover today?" />
        <Link href="/settings" asChild>
          <Pressable style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line }}>
            <Settings stroke={colors.primary} size={21} />
          </Pressable>
        </Link>
      </View>
      <OfflineIndicator />
      <View style={{ backgroundColor: colors.primary, borderRadius: 32, padding: 22, gap: 12, ...shadows.soft }}>
        <Text selectable style={{ color: colors.gold, fontWeight: "900", fontSize: 14 }}>KilimoScope AI</Text>
        <Text selectable style={{ color: colors.white, fontSize: 28, lineHeight: 33, fontWeight: "900" }}>Know what grows where in Tanzania.</Text>
        <Text selectable style={{ color: "#DDEBDD", lineHeight: 21 }}>A premium crop intelligence dashboard for farmers, investors, agronomists, NGOs, and institutions.</Text>
      </View>
      <View style={{ gap: 14 }}>
        <ActionCard href="/find-area" title="What can grow in my area?" description="Select your region or use your location to discover suitable crops." icon={MapPin} button="Find crops" />
        <ActionCard href="/find-crop" title="Where can this crop grow best?" description="Choose a crop, fruit, spice, or herb and see the best areas in Tanzania." icon={Search} button="Search crop" />
      </View>
      <SectionHeader title="Popular crop searches" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {popular.map((name) => {
          const crop = crops.find((item) => item.name === name);
          return (
            <Link key={name} href={crop ? `/crop/${crop.id}` : "/find-crop"} asChild>
              <Pressable style={{ backgroundColor: colors.white, borderRadius: 20, padding: 14, minWidth: 132, borderWidth: 1, borderColor: colors.line }}>
                <Leaf stroke={colors.primary} size={21} />
                <Text style={{ color: colors.text, fontWeight: "900", marginTop: 10 }}>{name}</Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <StatCard value="31" label="Regions" />
        <StatCard value="185+" label="Districts" />
        <StatCard value={`${crops.length}+`} label="Crops" />
        <StatCard value="AI" label="Advisor" />
      </View>
      <View style={{ backgroundColor: colors.white, borderRadius: 28, padding: 18, gap: 12, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
        <Bot stroke={colors.gold} size={28} />
        <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>Ask Kilimo AI</Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>Get farming advice in English or Kiswahili, with crop and region context.</Text>
        <Link href="/(tabs)/ask-ai" asChild><Pressable><PrimaryButton label="Open advisor" icon={Sprout} /></Pressable></Link>
      </View>
    </Screen>
  );
}

