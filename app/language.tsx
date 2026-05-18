import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Screen } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { useAppStore } from "@/stores/app-store";
import type { Language } from "@/types";

export default function LanguageScreen() {
  const setLanguage = useAppStore((state) => state.setLanguage);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const language = useAppStore((state) => state.language);

  function choose(next: Language) {
    setLanguage(next);
    completeOnboarding();
    router.replace("/(tabs)/home");
  }

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: colors.text, fontSize: 31, fontWeight: "900" }}>Choose your language</Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 22 }}>The app is English-first for this MVP, with translation structure ready for Kiswahili.</Text>
      </View>
      {[
        { id: "en" as const, title: "English", body: "Use KilimoScope AI in English." },
        { id: "sw" as const, title: "Kiswahili", body: "Muundo umeandaliwa kwa tafsiri za Kiswahili." },
      ].map((option) => (
        <Pressable key={option.id} onPress={() => choose(option.id)} style={{ backgroundColor: colors.white, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: language === option.id ? colors.primary : colors.line, flexDirection: "row", alignItems: "center", gap: 14, ...shadows.card }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: language === option.id ? colors.primary : colors.softGreen, alignItems: "center", justifyContent: "center" }}>
            {language === option.id ? <Check stroke={colors.white} size={18} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{option.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{option.body}</Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

