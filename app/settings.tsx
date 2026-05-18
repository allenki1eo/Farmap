import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { AppHeader, InfoPill, Screen, SectionHeader } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { useAppStore } from "@/stores/app-store";
import type { Language } from "@/types";

export default function SettingsScreen() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [units, setUnits] = useState("Acres");
  const [notifications, setNotifications] = useState(true);
  const [sync, setSync] = useState(true);

  return (
    <Screen>
      <AppHeader title="Settings" subtitle="Preferences, offline status, and data-use guidance." />
      <SectionHeader title="Language" />
      <Segment value={language} options={[{ label: "English", value: "en" }, { label: "Kiswahili", value: "sw" }]} onChange={(value) => setLanguage(value as Language)} />
      <SectionHeader title="Units" />
      <Segment value={units} options={[{ label: "Acres", value: "Acres" }, { label: "Hectares", value: "Hectares" }, { label: "Celsius", value: "Celsius" }, { label: "Millimeters", value: "Millimeters" }]} onChange={setUnits} />
      <SettingRow title="Notifications" body="Receive farming reminders and saved report updates." value={notifications} onValueChange={setNotifications} />
      <SettingRow title="Offline data sync" body="Basic crop and region data available offline." value={sync} onValueChange={setSync} />
      <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
        <Text selectable style={{ color: colors.text, fontSize: 19, fontWeight: "900" }}>About KilimoScope AI</Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>KilimoScope AI provides decision-support information based on available agricultural, climate, soil, and crop suitability data.</Text>
        <InfoPill label="Offline data: Basic crop and region data available." />
      </View>
      <View style={{ backgroundColor: "#FFF6E8", borderRadius: 24, padding: 16, gap: 8, borderWidth: 1, borderColor: "#F7D7A4" }}>
        <Text selectable style={{ color: colors.warning, fontSize: 18, fontWeight: "900" }}>Data sources disclaimer</Text>
        <Text selectable style={{ color: colors.text, lineHeight: 22 }}>Recommendations are based on available climate, soil, and crop suitability data. Farmers should also consult local agronomists or extension officers before making major investments.</Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>KilimoScope AI should not replace professional agronomic advice, field soil testing, or official weather warnings.</Text>
      </View>
    </Screen>
  );
}

function Segment({ value, options, onChange }: { value: string; options: { label: string; value: string }[]; onChange: (value: string) => void }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {options.map((option) => (
        <Pressable key={option.value} onPress={() => onChange(option.value)} style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: value === option.value ? colors.primary : colors.white, borderWidth: 1, borderColor: value === option.value ? colors.primary : colors.line }}>
          <Text style={{ color: value === option.value ? colors.white : colors.text, fontWeight: "900" }}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SettingRow({ title, body, value, onValueChange }: { title: string; body: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", gap: 12, ...shadows.card }}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{title}</Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{body}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.softGreen, false: colors.line }} thumbColor={value ? colors.primary : colors.muted} />
    </View>
  );
}

