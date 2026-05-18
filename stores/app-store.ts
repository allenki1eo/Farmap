import { create } from "zustand";
import type { Language } from "@/types";
import { offlineService } from "@/services/offline";

type AppStore = {
  language: Language;
  hasCompletedOnboarding: boolean;
  selectedRegion?: string;
  selectedCrop?: string;
  hydrate: () => void;
  setLanguage: (language: Language) => void;
  completeOnboarding: () => void;
  setSelectedRegion: (regionId?: string) => void;
  setSelectedCrop: (cropId?: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  language: "en",
  hasCompletedOnboarding: false,
  hydrate: () =>
    set({
      language: offlineService.getLanguage(),
      hasCompletedOnboarding: offlineService.getOnboardingStatus(),
    }),
  setLanguage: (language) => {
    offlineService.setLanguage(language);
    set({ language });
  },
  completeOnboarding: () => {
    offlineService.setOnboardingStatus(true);
    set({ hasCompletedOnboarding: true });
  },
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  setSelectedCrop: (selectedCrop) => set({ selectedCrop }),
}));
