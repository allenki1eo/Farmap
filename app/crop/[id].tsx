import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { Bot, FileText } from "lucide-react-native";
import { Text, View } from "react-native";
import { AppHeader, InfoCard, InfoPill, LoadingState, PrimaryButton, RiskBadge, Screen, SecondaryButton, SectionHeader, SuitabilityBadge } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getCropById, getSuitableAreasForCrop } from "@/services/api";
import { useSavedStore } from "@/stores/saved-store";

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: crop, isLoading } = useQuery({ queryKey: ["crop", id], queryFn: () => getCropById(id) });
  const { data: areas = [] } = useQuery({ queryKey: ["suitable-areas", id], queryFn: () => getSuitableAreasForCrop(id), enabled: Boolean(id) });
  const saveItem = useSavedStore((state) => state.saveItem);

  if (isLoading || !crop) return <Screen><LoadingState /></Screen>;

  return (
    <Screen>
      <AppHeader title={crop.name} subtitle={crop.description} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <InfoPill label={crop.category} />
        <InfoPill label={`Water: ${crop.waterRequirement}`} color={colors.blue} />
        <RiskBadge risk={crop.riskLevel} />
      </View>
      <SecondaryButton label="Save crop" onPress={() => saveItem({ type: "Crop", title: crop.name, subtitle: crop.description, payload: crop })} />
      <SectionHeader title="Suitability Summary" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <InfoCard title="Best zones" value={crop.bestZones.slice(0, 2).join(", ")} />
        <InfoCard title="Opportunity" value={crop.marketPotential} tint="#FFF5D6" />
        <InfoCard title="Growing period" value={`${crop.growingPeriodDays} days`} />
        <InfoCard title="Water need" value={crop.waterRequirement} tint="#E8F4FC" />
      </View>
      <SectionHeader title="Best Areas in Tanzania" />
      {areas.slice(0, 5).map((area) => (
        <View key={area.regionId} style={{ backgroundColor: colors.white, borderRadius: 22, padding: 15, gap: 9, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <Text selectable style={{ color: colors.text, fontSize: 19, fontWeight: "900" }}>{area.regionName}</Text>
            <SuitabilityBadge score={area.score} label={area.suitabilityClass} />
          </View>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{area.districtExamples.join(", ")}</Text>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{area.reason}</Text>
        </View>
      ))}
      <SectionHeader title="Crop Requirements" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <InfoCard title="Rainfall" value={`${crop.rainfallMin}-${crop.rainfallMax} mm`} />
        <InfoCard title="Temperature" value={`${crop.temperatureMin}-${crop.temperatureMax} C`} />
        <InfoCard title="Soil pH" value={`${crop.soilPhMin}-${crop.soilPhMax}`} />
        <InfoCard title="Altitude" value={`${crop.altitudeMin}-${crop.altitudeMax} m`} />
        <InfoCard title="Drainage" value={crop.soilDrainage} />
        <InfoCard title="Sunlight" value={crop.sunlight} />
      </View>
      <SectionHeader title="Farming Calendar" />
      <Timeline items={["Land preparation", "Planting", "Weeding", "Fertilizer", "Harvesting"]} />
      <SectionHeader title="Risks" />
      <Timeline items={["Drought exposure varies by district", "Pests require monitoring", "Disease risk rises with poor spacing", "Market risk depends on buyer access", "Soil testing recommended before investment"]} />
      <View style={{ backgroundColor: colors.primary, borderRadius: 28, padding: 18, gap: 12 }}>
        <Bot stroke={colors.gold} size={26} />
        <Text selectable style={{ color: colors.white, fontSize: 21, fontWeight: "900" }}>Kilimo AI explains why this crop performs well in these areas...</Text>
        <PrimaryButton label="Ask AI about this crop" onPress={() => router.push("/(tabs)/ask-ai")} />
      </View>
      <SecondaryButton label="Generate crop suitability report" icon={FileText} onPress={() => router.push("/reports")} />
    </Screen>
  );
}

function Timeline({ items }: { items: string[] }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 12, borderWidth: 1, borderColor: colors.line }}>
      {items.map((item, index) => (
        <View key={item} style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.softGreen, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.primary, fontWeight: "900" }}>{index + 1}</Text>
          </View>
          <Text selectable style={{ color: colors.text, fontWeight: "800", flex: 1 }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
