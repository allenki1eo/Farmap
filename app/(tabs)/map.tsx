import { useQuery } from "@tanstack/react-query";
import { Bot, Layers } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { LeafletMap } from "@/components/LeafletMap";
import { InsightBottomSheet, LoadingState, MapLayerControl, SearchBar } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getRegions } from "@/services/api";
import { useSavedStore } from "@/stores/saved-store";
import type { MapLayer, Region } from "@/types";

const layers: MapLayer[] = ["Crop Suitability", "Rainfall", "Temperature", "Soil", "Drought Risk", "Market Access"];

const LAYER_META: Record<MapLayer, { emoji: string; desc: string }> = {
  "Crop Suitability": { emoji: "🌱", desc: "Marker color = confidence score" },
  Rainfall:          { emoji: "🌧️", desc: "Blue = high rainfall, amber = low" },
  Temperature:       { emoji: "🌡️", desc: "Blue = cool, green = warm, orange = hot" },
  Soil:              { emoji: "🪨", desc: "Brown markers = soil data available" },
  "Drought Risk":    { emoji: "🏜️", desc: "Green = low risk, red = high risk" },
  "Market Access":   { emoji: "🏪", desc: "Green = strong market, amber = limited" },
};

export default function MapScreen() {
  const { data: regions = [], isLoading } = useQuery({ queryKey: ["regions"], queryFn: getRegions });
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<MapLayer>("Crop Suitability");
  const [selected, setSelected] = useState<Region | undefined>();
  const [legendVisible, setLegendVisible] = useState(false);
  const saveItem = useSavedStore((state) => state.saveItem);

  const filtered = query.trim()
    ? regions.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.topCrops.join(" ").toLowerCase().includes(query.toLowerCase())
      )
    : regions;

  const inFiltered = selected && filtered.some((r) => r.id === selected.id);
  const current = (inFiltered ? selected : undefined) ?? filtered[0] ?? regions[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Top search bar overlaid on map */}
      <View style={{ position: "absolute", top: 54, left: 16, right: 16, zIndex: 10, flexDirection: "row", gap: 10, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search region or crop..." />
        </View>
        <MapLayerControl layers={layers} selected={layer} onSelect={setLayer} />
      </View>

      {/* Layer legend pill */}
      <Pressable
        onPress={() => setLegendVisible(true)}
        style={{ position: "absolute", top: 116, left: 16, zIndex: 10, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, ...shadows.card }}
      >
        <Text style={{ fontSize: 13 }}>{LAYER_META[layer].emoji}</Text>
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>{layer}</Text>
        <Layers stroke={colors.muted} size={12} />
      </Pressable>

      {/* Map */}
      {isLoading || filtered.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LoadingState label="Loading map data..." />
        </View>
      ) : (
        <LeafletMap
          regions={filtered}
          selectedRegion={current}
          layer={layer}
          onRegionSelect={setSelected}
          style={{ flex: 1 }}
        />
      )}

      {/* AI FAB */}
      <Pressable style={{ position: "absolute", right: 16, bottom: 220, width: 52, height: 52, borderRadius: 18, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", ...shadows.card }}>
        <Bot stroke={colors.primary} size={23} />
      </Pressable>

      {/* Bottom sheet */}
      <InsightBottomSheet
        region={current}
        onSave={() =>
          current &&
          saveItem({
            type: "Area",
            title: current.name,
            subtitle: current.climateType,
            payload: current,
          })
        }
      />

      {/* Layer legend modal */}
      <Modal transparent visible={legendVisible} animationType="fade" onRequestClose={() => setLegendVisible(false)}>
        <Pressable onPress={() => setLegendVisible(false)} style={{ flex: 1, backgroundColor: "rgba(23,35,26,0.32)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.cream, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, gap: 14 }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Map legend</Text>
            {layers.map((l) => (
              <Pressable
                key={l}
                onPress={() => { setLayer(l); setLegendVisible(false); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 18, backgroundColor: l === layer ? colors.softGreen : colors.white, borderWidth: 1, borderColor: l === layer ? colors.primary : colors.line }}
              >
                <Text style={{ fontSize: 20 }}>{LAYER_META[l].emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "900" }}>{l}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{LAYER_META[l].desc}</Text>
                </View>
                {l === layer && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
