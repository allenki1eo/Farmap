import { aiKeywordResponses } from "@/data/aiResponses";
import { crops } from "@/data/crops";
import { districts } from "@/data/districts";
import { regions } from "@/data/regions";
import { buildSuitability, suitability } from "@/data/suitability";
import { offlineService } from "@/services/offline";
import type { AIResponse, AreaRecommendationParams, SavedItem } from "@/types";
import { getSuitabilityClass, makeId } from "@/utils/suitability";

const delay = (ms = 380) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRegions() {
  await delay();
  return regions;
}

export async function getRegionById(id: string) {
  await delay(260);
  return regions.find((region) => region.id === id);
}

export async function getDistrictsByRegion(regionId: string) {
  await delay(260);
  return districts.filter((district) => district.regionId === regionId);
}

export async function getCrops() {
  await delay();
  return crops;
}

export async function getCropById(id: string) {
  await delay(260);
  return crops.find((crop) => crop.id === id);
}

export async function getRecommendedCropsByArea(params: AreaRecommendationParams) {
  await delay(520);
  const region = regions.find((item) => item.id === params.regionId);
  if (!region) return [];

  const cropNames = new Set(region.topCrops);
  const regionCrops = crops.filter((crop) => cropNames.has(crop.name) || crop.suitableRegions.includes(region.id));
  return regionCrops
    .map((crop) => buildSuitability(crop.id, region.id))
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, 12)
    .map((item) => ({
      ...item!,
      reason: item!.score >= 75
        ? `${item!.cropName} matches ${region.name}'s ${region.climateType.toLowerCase()} conditions and the selected farming goal.`
        : item!.reason,
      suitabilityClass: getSuitabilityClass(item!.score),
    }));
}

export async function getSuitableAreasForCrop(cropId: string) {
  await delay(520);
  return suitability
    .filter((item) => item.cropId === cropId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function fallbackAI(message: string): AIResponse {
  return {
    recommendation: "Start by matching crop choice to rainfall, soil drainage, water access, market demand, and farm size.",
    recommendedItems: ["Sunflower", "Maize", "Beans", "Moringa"],
    why: "These are common planning anchors while more precise local data is collected.",
    warning: "This is mock guidance and should not replace local agronomist advice or soil testing.",
    nextSteps: ["Choose a region", "Confirm water availability", "Compare crop suitability", "Save a report for follow-up"],
    suitability: "Context needed",
    context: {},
  };
}

export async function askAI(message: string, context?: Record<string, unknown>) {
  await delay(900);
  const lower = message.toLowerCase();
  const key = Object.keys(aiKeywordResponses).find((item) => lower.includes(item));
  const response = key ? aiKeywordResponses[key] : fallbackAI(message);
  return {
    ...response,
    context: {
      ...response.context,
      ...(context ?? {}),
    },
  };
}

export async function getSavedItems() {
  await delay(180);
  return offlineService.getSavedItems();
}

export async function saveItem(item: Omit<SavedItem, "id" | "createdAt"> & Partial<Pick<SavedItem, "id" | "createdAt">>) {
  await delay(120);
  const saved: SavedItem = {
    id: item.id ?? makeId("saved"),
    createdAt: item.createdAt ?? new Date().toISOString(),
    type: item.type,
    title: item.title,
    subtitle: item.subtitle,
    payload: item.payload,
  };
  const existing = offlineService.getSavedItems();
  const next = [saved, ...existing.filter((entry) => entry.id !== saved.id)];
  offlineService.setSavedItems(next);
  return saved;
}

export async function removeSavedItem(id: string) {
  await delay(120);
  offlineService.setSavedItems(offlineService.getSavedItems().filter((item) => item.id !== id));
  return true;
}

export async function getReports() {
  await delay(320);
  return [
    { id: "best-crops-area", title: "Best crops for my area", description: "Ranked crop suitability and risks for a selected district.", date: "2026-05-18", status: "Ready" as const, type: "Area" },
    { id: "best-areas-crop", title: "Best areas for selected crop", description: "Top regions, district examples, warnings, and opportunity notes.", date: "2026-05-18", status: "Ready" as const, type: "Crop" },
    { id: "investment", title: "Crop investment report", description: "Market potential, climate fit, and farm planning assumptions.", date: "2026-05-18", status: "Draft" as const, type: "Investment" },
    { id: "risk", title: "Climate risk report", description: "Drought, flood, and soil risk snapshot for planning.", date: "2026-05-18", status: "Ready" as const, type: "Climate" },
    { id: "farm-plan", title: "Farm plan report", description: "Seasonal tasks and next steps for a selected crop and land size.", date: "2026-05-18", status: "Draft" as const, type: "Farm Plan" },
  ];
}
