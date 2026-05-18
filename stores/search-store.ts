import { create } from "zustand";
import { offlineService } from "@/services/offline";

type SearchStore = {
  recentSearches: string[];
  hydrate: () => void;
  addRecentSearch: (query: string) => void;
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  recentSearches: [],
  hydrate: () => set({ recentSearches: offlineService.getRecentSearches() }),
  addRecentSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const next = [trimmed, ...get().recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 12);
    offlineService.setRecentSearches(next);
    set({ recentSearches: next });
  },
}));
