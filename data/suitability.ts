import type { SuitabilityResult } from "@/types";
import { crops } from "@/data/crops";
import { regions } from "@/data/regions";
import { districts } from "@/data/districts";
import { getSuitabilityClass } from "@/utils/suitability";

const overrides: Record<string, Record<string, number>> = {
  avocado: { njombe: 92, mbeya: 90, iringa: 86, kilimanjaro: 84, arusha: 81, dodoma: 38 },
  sunflower: { dodoma: 91, singida: 89, shinyanga: 84, tabora: 80, manyara: 78 },
  moringa: { dodoma: 88, singida: 86, lindi: 82, mtwara: 80, manyara: 78 },
  vanilla: { morogoro: 82, kagera: 80, tanga: 78, kilimanjaro: 72, dodoma: 25 },
  rice: { morogoro: 90, mwanza: 82, tanga: 78, "dar-es-salaam": 72, dodoma: 22 },
};

function baseScore(cropId: string, regionId: string) {
  if (overrides[cropId]?.[regionId]) return overrides[cropId][regionId];
  const crop = crops.find((item) => item.id === cropId);
  if (!crop) return 40;
  if (crop.suitableRegions.includes(regionId)) return 76 + ((crop.name.length + regionId.length) % 18);
  return 28 + ((crop.name.length + regionId.length) % 28);
}

export function buildSuitability(cropId: string, regionId: string): SuitabilityResult | undefined {
  const crop = crops.find((item) => item.id === cropId);
  const region = regions.find((item) => item.id === regionId);
  if (!crop || !region) return undefined;
  const score = baseScore(cropId, regionId);
  const localDistricts = districts.filter((district) => district.regionId === regionId).slice(0, 3).map((district) => district.name);
  return {
    cropId: crop.id,
    cropName: crop.name,
    category: crop.category,
    regionId: region.id,
    regionName: region.name,
    score,
    suitabilityClass: getSuitabilityClass(score),
    reason: score >= 75
      ? `${crop.name} fits ${region.name}'s ${region.climateType.toLowerCase()} conditions and market opportunity.`
      : `${crop.name} has constraints in ${region.name}; water, temperature, or soil management may limit performance.`,
    warning: score < 50 ? "Consider this only with specialist agronomy advice, irrigation, and site testing." : undefined,
    waterNeed: crop.waterRequirement,
    riskLevel: crop.riskLevel,
    districtExamples: localDistricts,
  };
}

export const suitability = crops.flatMap((crop) =>
  regions.map((region) => buildSuitability(crop.id, region.id)).filter(Boolean) as SuitabilityResult[],
);
