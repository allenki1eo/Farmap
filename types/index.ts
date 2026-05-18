export type Language = "en" | "sw";

export type CropCategory =
  | "Food Crops"
  | "Cash Crops"
  | "Fruits"
  | "Vegetables"
  | "Spices"
  | "Herbs"
  | "Medicinal Plants"
  | "Export Crops"
  | "Drought-Tolerant Crops";

export type RiskLevel = "Low" | "Medium" | "High";
export type WaterRequirement = "Low" | "Low-Medium" | "Medium" | "Medium-High" | "High";
export type SuitabilityClass = "Very High" | "High" | "Medium" | "Low" | "Not Recommended";

export type Region = {
  id: string;
  name: string;
  climateType: string;
  annualRainfall: string;
  avgTemperature: string;
  rainySeason: string;
  drySeason: string;
  droughtRisk: RiskLevel;
  floodRisk: RiskLevel;
  topCrops: string[];
  suitableHerbs: string[];
  description: string;
  confidence: number;
};

export type District = {
  id: string;
  regionId: string;
  name: string;
};

export type Crop = {
  id: string;
  name: string;
  scientificName?: string;
  category: CropCategory;
  description: string;
  waterRequirement: WaterRequirement;
  growingPeriodDays: number;
  bestZones: string[];
  rainfallMin: number;
  rainfallMax: number;
  temperatureMin: number;
  temperatureMax: number;
  altitudeMin: number;
  altitudeMax: number;
  soilPhMin: number;
  soilPhMax: number;
  soilDrainage: string;
  sunlight: string;
  marketPotential: "Low" | "Medium" | "High" | "Very High";
  riskLevel: RiskLevel;
  suitableRegions: string[];
};

export type SuitabilityResult = {
  cropId: string;
  cropName: string;
  category: CropCategory;
  regionId: string;
  regionName: string;
  score: number;
  suitabilityClass: SuitabilityClass;
  reason: string;
  warning?: string;
  waterNeed: WaterRequirement;
  riskLevel: RiskLevel;
  districtExamples: string[];
};

export type AreaRecommendationParams = {
  regionId: string;
  districtId?: string;
  waterAvailability?: string;
  farmingGoal?: string;
  landSizeAcres?: number;
};

export type SavedItem = {
  id: string;
  type: "Crop" | "Area" | "AI Advice" | "Report";
  title: string;
  subtitle?: string;
  payload?: unknown;
  createdAt: string;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "Ready" | "Draft";
  type: string;
};

export type AIResponse = {
  recommendation: string;
  recommendedItems: string[];
  why: string;
  warning: string;
  nextSteps: string[];
  suitability?: string;
  context?: {
    crop?: string;
    region?: string;
  };
};

export type MapLayer =
  | "Crop Suitability"
  | "Rainfall"
  | "Temperature"
  | "Soil"
  | "Drought Risk"
  | "Market Access";
