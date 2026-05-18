import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { AppHeader, CropCard, FilterChips, LoadingState, PrimaryButton, Screen } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { getDistrictsByRegion, getRecommendedCropsByArea, getRegions } from "@/services/api";
import type { SuitabilityResult } from "@/types";

const waterOptions = ["Rain-fed only", "Irrigation available", "River/water source nearby", "Not sure"];
const goalOptions = ["Food", "Cash crop", "Export", "Herbs/medicinal plants", "Mixed"];
const sortOptions = ["Highest suitability", "Low water need", "Cash potential", "Low risk"];

export default function FindAreaScreen() {
  const { data: regions = [] } = useQuery({ queryKey: ["regions"], queryFn: getRegions });
  const [regionId, setRegionId] = useState("dodoma");
  const [districtId, setDistrictId] = useState<string | undefined>();
  const [waterAvailability, setWaterAvailability] = useState(waterOptions[0]);
  const [farmingGoal, setFarmingGoal] = useState(goalOptions[1]);
  const [landSize, setLandSize] = useState("3");
  const [sort, setSort] = useState(sortOptions[0]);
  const { data: districts = [] } = useQuery({ queryKey: ["districts", regionId], queryFn: () => getDistrictsByRegion(regionId) });
  const mutation = useMutation({ mutationFn: getRecommendedCropsByArea });

  const results = useMemo(() => {
    const items = [...(mutation.data ?? [])] as SuitabilityResult[];
    if (sort === "Low water need") return items.sort((a, b) => a.waterNeed.length - b.waterNeed.length);
    if (sort === "Low risk") return items.sort((a, b) => (a.riskLevel > b.riskLevel ? 1 : -1));
    return items.sort((a, b) => b.score - a.score);
  }, [mutation.data, sort]);

  return (
    <Screen>
      <AppHeader title="Find crops for my area" subtitle="Choose a location and farming context to rank suitable crops." />
      <Select label="Region" value={regionId} options={regions.map((region) => ({ label: region.name, value: region.id }))} onChange={(value) => { setRegionId(value); setDistrictId(undefined); }} />
      <Select label="District" value={districtId ?? districts[0]?.id ?? ""} options={districts.map((district) => ({ label: district.name, value: district.id }))} onChange={setDistrictId} />
      <Select label="Water availability" value={waterAvailability} options={waterOptions.map((item) => ({ label: item, value: item }))} onChange={setWaterAvailability} />
      <Select label="Farming goal" value={farmingGoal} options={goalOptions.map((item) => ({ label: item, value: item }))} onChange={setFarmingGoal} />
      <View style={{ backgroundColor: colors.white, borderRadius: 22, padding: 15, gap: 8, borderWidth: 1, borderColor: colors.line }}>
        <Text style={{ color: colors.muted, fontWeight: "900" }}>Land size (acres)</Text>
        <TextInput value={landSize} onChangeText={setLandSize} keyboardType="numeric" style={{ color: colors.text, fontWeight: "900", fontSize: 18 }} />
      </View>
      <PrimaryButton label="Recommend Crops" onPress={() => mutation.mutate({ regionId, districtId, waterAvailability, farmingGoal, landSizeAcres: Number(landSize) || 0 })} />
      {mutation.isPending ? <LoadingState /> : null}
      {results.length ? (
        <>
          <FilterChips options={sortOptions} value={sort} onChange={setSort} />
          {results.map((result) => <CropCard key={`${result.cropId}-${result.regionId}`} result={result} />)}
        </>
      ) : null}
    </Screen>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: { label: string; value: string }[]; onChange: (value: string) => void }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 22, padding: 15, gap: 10, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
      <Text style={{ color: colors.muted, fontWeight: "900" }}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable key={option.value} onPress={() => onChange(option.value)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: active ? colors.primary : colors.softGreen }}>
              <Text style={{ color: active ? colors.white : colors.primary, fontWeight: "900", fontSize: 12 }}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

