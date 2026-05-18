import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AppHeader, FilterChips, RegionCard, Screen, SearchBar, SuitabilityBadge } from "@/components/ui";
import { colors } from "@/constants/theme";
import { getCrops, getSuitableAreasForCrop } from "@/services/api";

const categories = ["All", "Food Crops", "Cash Crops", "Fruits", "Vegetables", "Herbs", "Spices", "Export Crops"];

export default function FindCropScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cropId, setCropId] = useState("avocado");
  const { data: crops = [] } = useQuery({ queryKey: ["crops"], queryFn: getCrops });
  const { data: areas = [] } = useQuery({ queryKey: ["suitable-areas", cropId], queryFn: () => getSuitableAreasForCrop(cropId) });
  const filtered = useMemo(() => crops.filter((crop) => (category === "All" || crop.category === category) && crop.name.toLowerCase().includes(query.toLowerCase())).slice(0, 18), [crops, category, query]);
  const selectedCrop = crops.find((crop) => crop.id === cropId);

  return (
    <Screen>
      <AppHeader title="Find best areas for crop" subtitle="Search a crop, fruit, spice, or herb and compare top regions." />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search crop, fruit, spice, or herb..." />
      <FilterChips options={categories} value={category} onChange={setCategory} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9 }}>
        {filtered.map((crop) => (
          <Pressable key={crop.id} onPress={() => setCropId(crop.id)} onLongPress={() => router.push(`/crop/${crop.id}`)} style={{ backgroundColor: crop.id === cropId ? colors.primary : colors.white, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, borderColor: crop.id === cropId ? colors.primary : colors.line }}>
            <Text style={{ color: crop.id === cropId ? colors.white : colors.text, fontWeight: "900" }}>{crop.name}</Text>
          </Pressable>
        ))}
      </View>
      {selectedCrop ? (
        <View style={{ backgroundColor: colors.white, borderRadius: 26, padding: 16, gap: 9, borderWidth: 1, borderColor: colors.line }}>
          <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>{selectedCrop.name}</Text>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{selectedCrop.description}</Text>
        </View>
      ) : null}
      {areas.map((area, index) => (
        <Pressable key={area.regionId} onPress={() => router.push(`/region/${area.regionId}`)} style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 9, borderWidth: 1, borderColor: colors.line }}>
          <Text selectable style={{ color: colors.muted, fontWeight: "900" }}>#{index + 1}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>{area.regionName}</Text>
            <SuitabilityBadge score={area.score} label={area.suitabilityClass} />
          </View>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{area.reason}</Text>
          {area.warning ? <Text selectable style={{ color: colors.warning, fontWeight: "800" }}>{area.warning}</Text> : null}
        </Pressable>
      ))}
    </Screen>
  );
}

