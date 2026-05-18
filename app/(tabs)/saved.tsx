import { useEffect } from "react";
import { EmptyState, OfflineIndicator, Screen, SecondaryButton, SectionHeader } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { useSavedStore } from "@/stores/saved-store";
import { Text, View } from "react-native";

export default function SavedScreen() {
  const { savedItems, hydrate, removeItem } = useSavedStore();
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Screen>
      <SectionHeader title="Saved Recommendations" />
      <OfflineIndicator />
      {savedItems.length === 0 ? (
        <EmptyState title="You have not saved anything yet." body="Save crops, locations, AI answers, and reports for offline review." />
      ) : (
        savedItems.map((item) => (
          <View key={item.id} style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 9, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
            <Text selectable style={{ color: colors.text, fontSize: 19, fontWeight: "900" }}>{item.title}</Text>
            <Text selectable style={{ color: colors.muted, fontWeight: "800" }}>{item.type} - {new Date(item.createdAt).toLocaleDateString()}</Text>
            {item.subtitle ? <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{item.subtitle}</Text> : null}
            <SecondaryButton label="Remove" onPress={() => removeItem(item.id)} />
          </View>
        ))
      )}
    </Screen>
  );
}

