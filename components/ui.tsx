import { Image } from "expo-image";
import { Link } from "expo-router";
import { ArrowRight, Bookmark, CloudOff, Filter, Search } from "lucide-react-native";
import React from "react";
import type { ComponentType, ReactNode } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors, radii, shadows } from "@/constants/theme";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { Crop, MapLayer, Region, Report, RiskLevel, SavedItem, SuitabilityResult } from "@/types";
import { scoreColor } from "@/utils/suitability";

type IconComponent = ComponentType<{ stroke?: string; size?: number; strokeWidth?: number }>;

export function Screen({ children, padded = true }: { children: ReactNode; padded?: boolean }) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: padded ? 18 : 0, gap: 18, paddingBottom: 112 }}
    >
      {children}
    </ScrollView>
  );
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text selectable style={{ color: colors.muted, fontSize: 14, fontWeight: "700" }}>
        KilimoScope AI
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: 31, lineHeight: 36, fontWeight: "900" }}>
        {title}
      </Text>
      {subtitle ? <Text selectable style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon: Icon = ArrowRight }: { label: string; onPress?: () => void; icon?: IconComponent }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 54,
        borderRadius: 18,
        backgroundColor: colors.primary,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        opacity: pressed ? 0.86 : 1,
      })}
    >
      <Text style={{ color: colors.white, fontWeight: "900", fontSize: 16 }}>{label}</Text>
      <Icon stroke={colors.white} size={18} strokeWidth={2.6} />
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, icon: Icon = Bookmark }: { label: string; onPress?: () => void; icon?: IconComponent }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Icon stroke={colors.primary} size={17} strokeWidth={2.4} />
      <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>{title}</Text>
      {action ? <Text style={{ color: colors.primary, fontWeight: "800" }}>{action}</Text> : null}
    </View>
  );
}

export function ActionCard({ title, description, button, icon: Icon, href }: { title: string; description: string; button: string; icon: IconComponent; href: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable>
        <Animated.View entering={FadeInUp.duration(420)} style={{ backgroundColor: colors.card, borderRadius: 28, padding: 20, gap: 16, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
          <View style={{ width: 48, height: 48, borderRadius: 18, backgroundColor: colors.softGreen, alignItems: "center", justifyContent: "center" }}>
            <Icon stroke={colors.primary} size={25} strokeWidth={2.4} />
          </View>
          <View style={{ gap: 7 }}>
            <Text selectable style={{ color: colors.text, fontSize: 21, fontWeight: "900", lineHeight: 26 }}>{title}</Text>
            <Text selectable style={{ color: colors.muted, fontSize: 14, lineHeight: 21 }}>{description}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 15 }}>{button}</Text>
            <ArrowRight stroke={colors.primary} size={17} strokeWidth={2.6} />
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, minWidth: 142, backgroundColor: colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.line }}>
      <Text selectable style={{ color: colors.primary, fontSize: 24, fontWeight: "900", fontVariant: ["tabular-nums"] }}>{value}</Text>
      <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

export function SuitabilityBadge({ score, label }: { score?: number; label?: string }) {
  const bg = score !== undefined ? scoreColor(score) : colors.primary;
  return (
    <View style={{ alignSelf: "flex-start", borderRadius: 999, backgroundColor: bg, paddingHorizontal: 11, paddingVertical: 6 }}>
      <Text style={{ color: colors.white, fontSize: 12, fontWeight: "900" }}>{score !== undefined ? `${score}% ${label ?? ""}` : label}</Text>
    </View>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const bg = risk === "High" ? colors.danger : risk === "Medium" ? colors.warning : colors.primary;
  return (
    <View style={{ alignSelf: "flex-start", borderRadius: 999, backgroundColor: `${bg}18`, paddingHorizontal: 10, paddingVertical: 6 }}>
      <Text style={{ color: bg, fontSize: 12, fontWeight: "900" }}>{risk} risk</Text>
    </View>
  );
}

export function InfoCard({ title, value, tint = colors.softGreen }: { title: string; value: string; tint?: string }) {
  return (
    <View style={{ flex: 1, minWidth: 145, backgroundColor: tint, borderRadius: 20, padding: 15, gap: 5 }}>
      <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>{title}</Text>
      <Text selectable style={{ color: colors.text, fontSize: 16, fontWeight: "900" }}>{value}</Text>
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={{ minHeight: 52, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Search stroke={colors.muted} size={19} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={{ flex: 1, color: colors.text, fontWeight: "700", fontSize: 15 }} />
    </View>
  );
}

export function FilterChips({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable key={option} onPress={() => onChange(option)} style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: active ? colors.primary : colors.white, borderWidth: 1, borderColor: active ? colors.primary : colors.line }}>
            <Text style={{ color: active ? colors.white : colors.text, fontWeight: "900", fontSize: 13 }}>{option}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function CropCard({ crop, result }: { crop?: Crop; result?: SuitabilityResult }) {
  const item = crop;
  return (
    <Link href={`/crop/${result?.cropId ?? item?.id}` as never} asChild>
      <Pressable>
        <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 12, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 5 }}>
              <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>{result?.cropName ?? item?.name}</Text>
              <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>{result?.category ?? item?.category}</Text>
            </View>
            {result ? <SuitabilityBadge score={result.score} label={result.suitabilityClass} /> : <RiskBadge risk={item?.riskLevel ?? "Low"} />}
          </View>
          <Text selectable style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>{result?.reason ?? item?.description}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <InfoPill label={`Water: ${result?.waterNeed ?? item?.waterRequirement}`} />
            <InfoPill label={`Market: ${item?.marketPotential ?? "High"}`} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function RegionCard({ region }: { region: Region }) {
  return (
    <Link href={`/region/${region.id}` as never} asChild>
      <Pressable>
        <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 12, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>{region.name}</Text>
              <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>{region.climateType}</Text>
            </View>
            <SuitabilityBadge score={region.confidence} label="confidence" />
          </View>
          <Text selectable style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>{region.description}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {region.topCrops.slice(0, 4).map((crop) => <InfoPill key={crop} label={crop} />)}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function InfoPill({ label, color = colors.primary }: { label: string; color?: string }) {
  return (
    <View style={{ borderRadius: 999, backgroundColor: `${color}14`, paddingHorizontal: 10, paddingVertical: 6 }}>
      <Text style={{ color, fontSize: 12, fontWeight: "900" }}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 28, padding: 26, gap: 12, alignItems: "center", borderWidth: 1, borderColor: colors.line }}>
      <Image source={require("@/assets/kilimoscope-logo.png")} style={{ width: 82, height: 82, borderRadius: 24 }} />
      <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900", textAlign: "center" }}>{title}</Text>
      <Text selectable style={{ color: colors.muted, textAlign: "center", lineHeight: 21 }}>{body}</Text>
    </View>
  );
}

export function LoadingState({ label = "Loading agricultural intelligence..." }: { label?: string }) {
  return (
    <View style={{ padding: 24, alignItems: "center", gap: 12 }}>
      <ActivityIndicator color={colors.primary} />
      <Text selectable style={{ color: colors.muted, fontWeight: "800" }}>{label}</Text>
    </View>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <View style={{ borderRadius: 18, backgroundColor: "#FFF4E5", padding: 13, flexDirection: "row", gap: 10, alignItems: "center", borderWidth: 1, borderColor: "#F7D7A4" }}>
      <CloudOff stroke={colors.warning} size={18} />
      <Text selectable style={{ color: colors.warning, flex: 1, fontWeight: "800", lineHeight: 19 }}>Offline mode: cached crops, regions, and saved items are available. Live weather, AI, and climate updates require internet.</Text>
    </View>
  );
}

export function ReportCard({ report, onSave }: { report: Report; onSave?: () => void }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900", flex: 1 }}>{report.title}</Text>
        <InfoPill label={report.status} color={report.status === "Ready" ? colors.primary : colors.warning} />
      </View>
      <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{report.description}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text selectable style={{ color: colors.muted, fontWeight: "800" }}>{report.date}</Text>
        <SecondaryButton label="Save" onPress={onSave} />
      </View>
    </View>
  );
}

export function ChatMessageBubble({ role, children }: { role: "user" | "ai"; children: ReactNode }) {
  const isUser = role === "user";
  return (
    <View style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "88%", backgroundColor: isUser ? colors.primary : colors.white, borderRadius: 22, padding: 14, borderWidth: isUser ? 0 : 1, borderColor: colors.line }}>
      <Text selectable style={{ color: isUser ? colors.white : colors.text, lineHeight: 21, fontWeight: "700" }}>{children}</Text>
    </View>
  );
}

export function SuggestedPromptChips({ prompts, onPress }: { prompts: string[]; onPress: (prompt: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {prompts.map((prompt) => (
        <Pressable key={prompt} onPress={() => onPress(prompt)} style={{ backgroundColor: colors.softGreen, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 9 }}>
          <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 12 }}>{prompt}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function MapLayerControl({ layers, selected, onSelect }: { layers: MapLayer[]; selected: MapLayer; onSelect: (layer: MapLayer) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={{ width: 50, height: 50, borderRadius: 18, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", ...shadows.card }}>
        <Filter stroke={colors.primary} size={22} />
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: "rgba(23,35,26,0.32)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.cream, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, gap: 12 }}>
            <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>Map layers</Text>
            {layers.map((layer) => (
              <Pressable key={layer} onPress={() => { onSelect(layer); setOpen(false); }} style={{ padding: 16, borderRadius: 18, backgroundColor: layer === selected ? colors.primary : colors.white }}>
                <Text style={{ color: layer === selected ? colors.white : colors.text, fontWeight: "900" }}>{layer}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function InsightBottomSheet({ region, onSave }: { region?: Region; onSave?: () => void }) {
  if (!region) return null;
  return (
    <View style={{ position: "absolute", left: 16, right: 16, bottom: 20, backgroundColor: colors.white, borderRadius: 28, padding: 18, gap: 12, ...shadows.soft }}>
      <View style={{ width: 44, height: 4, borderRadius: 999, backgroundColor: colors.line, alignSelf: "center" }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>{region.name}</Text>
          <Text selectable style={{ color: colors.muted, fontWeight: "800" }}>{region.climateType}</Text>
        </View>
        <RiskBadge risk={region.droughtRisk} />
      </View>
      <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{region.description}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{region.topCrops.slice(0, 4).map((crop) => <InfoPill key={crop} label={crop} />)}</View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Link href={`/region/${region.id}` as never} asChild><Pressable style={{ flex: 1 }}><View style={{ minHeight: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}><Text style={{ color: colors.white, fontWeight: "900" }}>View profile</Text></View></Pressable></Link>
        <SecondaryButton label="Save" onPress={onSave} />
      </View>
    </View>
  );
}

