import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Bot, LocateFixed } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { InsightBottomSheet, MapLayerControl, SearchBar } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getRegions } from "@/services/api";
import { useSavedStore } from "@/stores/saved-store";
import type { MapLayer, Region } from "@/types";

const layers: MapLayer[] = ["Crop Suitability", "Rainfall", "Temperature", "Soil", "Drought Risk", "Market Access"];
const markerPositions = [
  [46, 28], [35, 32], [25, 35], [58, 22], [62, 16], [58, 50], [45, 72], [50, 66], [54, 76],
  [74, 80], [70, 75], [76, 38], [22, 24], [61, 86], [42, 46], [34, 48], [55, 35], [78, 58],
];

export default function MapScreen() {
  const { data: regions = [] } = useQuery({ queryKey: ["regions"], queryFn: getRegions });
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<MapLayer>("Crop Suitability");
  const [selected, setSelected] = useState<Region | undefined>();
  const saveItem = useSavedStore((state) => state.saveItem);
  const filtered = useMemo(() => regions.filter((region) => region.name.toLowerCase().includes(query.toLowerCase()) || region.topCrops.join(" ").toLowerCase().includes(query.toLowerCase())), [regions, query]);
  const current = selected ?? filtered[0] ?? regions[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <LinearGradient colors={["#DDEBDD", "#F7F3E8", "#BFDCC8"]} style={{ flex: 1 }}>
        <View style={{ position: "absolute", top: 58, left: 16, right: 16, zIndex: 5, flexDirection: "row", gap: 10, alignItems: "center" }}>
          <View style={{ flex: 1 }}><SearchBar value={query} onChangeText={setQuery} placeholder="Search region, district, crop..." /></View>
          <MapLayerControl layers={layers} selected={layer} onSelect={setLayer} />
        </View>
        <View style={{ marginTop: 132, marginHorizontal: 16, flex: 1, borderRadius: 34, overflow: "hidden", borderWidth: 1, borderColor: colors.line, ...shadows.soft }}>
          <LinearGradient colors={["#EAF4E6", "#D5E9D4", "#F3E5B4"]} style={{ flex: 1 }}>
            <Text selectable style={{ position: "absolute", top: 18, left: 18, color: colors.text, fontWeight: "900", fontSize: 18 }}>{layer}</Text>
            <Text selectable style={{ position: "absolute", top: 43, left: 18, color: colors.muted, fontWeight: "800" }}>Tanzania suitability intelligence</Text>
            {filtered.slice(0, 18).map((region, index) => {
              const [left, top] = markerPositions[index] ?? [50, 50];
              const active = current?.id === region.id;
              return (
                <Pressable key={region.id} onPress={() => setSelected(region)} style={{ position: "absolute", left: `${left}%`, top: `${top}%`, transform: [{ translateX: -18 }, { translateY: -18 }], alignItems: "center", gap: 3 }}>
                  <View style={{ width: active ? 38 : 30, height: active ? 38 : 30, borderRadius: 20, backgroundColor: active ? colors.gold : colors.primary, borderWidth: 3, borderColor: colors.white, alignItems: "center", justifyContent: "center" }}>
                    <LocateFixed stroke={colors.white} size={active ? 17 : 13} />
                  </View>
                  {active ? <Text style={{ color: colors.text, fontSize: 11, fontWeight: "900", backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 }}>{region.name}</Text> : null}
                </Pressable>
              );
            })}
          </LinearGradient>
        </View>
        <Pressable style={{ position: "absolute", right: 16, bottom: 245, width: 52, height: 52, borderRadius: 18, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", ...shadows.card }}>
          <Bot stroke={colors.primary} size={23} />
        </Pressable>
        <InsightBottomSheet region={current} onSave={() => current && saveItem({ type: "Area", title: current.name, subtitle: current.climateType, payload: current })} />
      </LinearGradient>
    </View>
  );
}

