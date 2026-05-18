import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { Bot } from "lucide-react-native";
import { Text, View } from "react-native";
import { AppHeader, InfoCard, InfoPill, LoadingState, PrimaryButton, RiskBadge, Screen, SecondaryButton, SectionHeader, SuitabilityBadge } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getRecommendedCropsByArea, getRegionById } from "@/services/api";
import { useSavedStore } from "@/stores/saved-store";

export default function RegionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: region, isLoading } = useQuery({ queryKey: ["region", id], queryFn: () => getRegionById(id) });
  const { data: crops = [] } = useQuery({ queryKey: ["recommended", id], queryFn: () => getRecommendedCropsByArea({ regionId: id }), enabled: Boolean(id) });
  const saveItem = useSavedStore((state) => state.saveItem);

  if (isLoading || !region) return <Screen><LoadingState /></Screen>;

  return (
    <Screen>
      <AppHeader title={region.name} subtitle={region.description} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <InfoPill label={region.climateType} />
        <SuitabilityBadge score={region.confidence} label="confidence" />
        <RiskBadge risk={region.droughtRisk} />
      </View>
      <SecondaryButton label="Save area" onPress={() => saveItem({ type: "Area", title: region.name, subtitle: region.climateType, payload: region })} />
      <SectionHeader title="Climate Overview" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <InfoCard title="Annual rainfall" value={region.annualRainfall} />
        <InfoCard title="Avg temperature" value={region.avgTemperature} tint="#E8F4FC" />
        <InfoCard title="Rainy season" value={region.rainySeason} />
        <InfoCard title="Dry season" value={region.drySeason} />
        <InfoCard title="Drought risk" value={region.droughtRisk} tint="#FFF5D6" />
        <InfoCard title="Flood risk" value={region.floodRisk} tint="#FDECEC" />
      </View>
      <SectionHeader title="Soil Overview" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <InfoCard title="Soil type" value="Loam to sandy loam" />
        <InfoCard title="Drainage" value="Moderate-good" />
        <InfoCard title="Fertility" value="Medium" />
        <InfoCard title="pH" value="5.5-7.5" />
      </View>
      <SectionHeader title="Best Crops" />
      {crops.slice(0, 6).map((item) => (
        <View key={item.cropId} style={{ backgroundColor: colors.white, borderRadius: 22, padding: 15, gap: 8, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{item.cropName}</Text>
            <SuitabilityBadge score={item.score} label={item.suitabilityClass} />
          </View>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{item.reason}</Text>
        </View>
      ))}
      <SectionHeader title="Best Herbs" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{region.suitableHerbs.map((herb) => <InfoPill key={herb} label={herb} />)}</View>
      <SectionHeader title="Farming Calendar" />
      <Text selectable style={{ color: colors.muted, lineHeight: 22, backgroundColor: colors.white, borderRadius: 22, padding: 16 }}>Plan land preparation before {region.rainySeason}, plant with reliable onset of rain, monitor pests during vegetative growth, and harvest during dry windows where possible.</Text>
      <SectionHeader title="Warnings" />
      <Text selectable style={{ color: colors.warning, lineHeight: 22, backgroundColor: "#FFF6E8", borderRadius: 22, padding: 16 }}>Climate risks vary by district. Use soil tests, local extension officers, and official weather warnings before major investments.</Text>
      <PrimaryButton label="Ask about this area" icon={Bot} onPress={() => router.push("/(tabs)/ask-ai")} />
    </Screen>
  );
}
