import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CropCard, FilterChips, LoadingState, OfflineIndicator, Screen, SearchBar, SectionHeader } from "@/components/ui";
import { getCrops } from "@/services/api";

const categories = ["All", "Food Crops", "Cash Crops", "Fruits", "Vegetables", "Spices", "Herbs", "Medicinal Plants", "Export Crops", "Drought-Tolerant Crops"];

export default function CropLibraryScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { data: crops = [], isLoading } = useQuery({ queryKey: ["crops"], queryFn: getCrops });
  const filtered = useMemo(() => crops.filter((crop) => {
    const matchesCategory = category === "All" || crop.category === category;
    const matchesQuery = crop.name.toLowerCase().includes(query.toLowerCase()) || crop.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [crops, category, query]);

  return (
    <Screen>
      <SectionHeader title="Crop Library" />
      <OfflineIndicator />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search crop, fruit, spice, or herb..." />
      <FilterChips options={categories} value={category} onChange={setCategory} />
      {isLoading ? <LoadingState /> : filtered.map((crop) => <CropCard key={crop.id} crop={crop} />)}
    </Screen>
  );
}

