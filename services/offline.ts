import "expo-sqlite/localStorage/install";
import * as Network from "expo-network";
import type { Language, SavedItem } from "@/types";

const keys = {
  language: "kilimoscope.language",
  onboarding: "kilimoscope.onboarding",
  savedItems: "kilimoscope.savedItems",
  recentSearches: "kilimoscope.recentSearches",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const offlineService = {
  getLanguage: () => read<Language>(keys.language, "en"),
  setLanguage: (language: Language) => write(keys.language, language),
  getOnboardingStatus: () => read<boolean>(keys.onboarding, false),
  setOnboardingStatus: (done: boolean) => write(keys.onboarding, done),
  getSavedItems: () => read<SavedItem[]>(keys.savedItems, []),
  setSavedItems: (items: SavedItem[]) => write(keys.savedItems, items),
  getRecentSearches: () => read<string[]>(keys.recentSearches, []),
  setRecentSearches: (items: string[]) => write(keys.recentSearches, items.slice(0, 12)),
  async isOnline() {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && state.isInternetReachable !== false);
  },
};
