import { create } from "zustand";
import { getSavedItems, removeSavedItem, saveItem } from "@/services/api";
import type { SavedItem } from "@/types";

type SavedStore = {
  savedItems: SavedItem[];
  hydrate: () => Promise<void>;
  saveItem: (item: Omit<SavedItem, "id" | "createdAt">) => Promise<SavedItem>;
  removeItem: (id: string) => Promise<void>;
};

export const useSavedStore = create<SavedStore>((set) => ({
  savedItems: [],
  hydrate: async () => set({ savedItems: await getSavedItems() }),
  saveItem: async (item) => {
    const saved = await saveItem(item);
    set((state) => ({ savedItems: [saved, ...state.savedItems.filter((entry) => entry.id !== saved.id)] }));
    return saved;
  },
  removeItem: async (id) => {
    await removeSavedItem(id);
    set((state) => ({ savedItems: state.savedItems.filter((item) => item.id !== id) }));
  },
}));
