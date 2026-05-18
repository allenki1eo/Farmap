import { useMutation } from "@tanstack/react-query";
import { Send, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ChatMessageBubble, InfoPill, LoadingState, OfflineIndicator, Screen, SecondaryButton, SectionHeader, SuggestedPromptChips } from "@/components/ui";
import { colors, shadows } from "@/constants/theme";
import { askAI } from "@/services/api";
import { useSavedStore } from "@/stores/saved-store";
import type { AIResponse } from "@/types";

const prompts = [
  "What can I grow in Dodoma?",
  "Where can avocado grow best in Tanzania?",
  "Can I grow vanilla in Morogoro?",
  "What herbs grow in dry areas?",
  "Give me a farm plan for 3 acres in Mbeya.",
  "What crops need little water?",
];

type Message = { id: string; role: "user" | "ai"; text: string; response?: AIResponse };

export default function AskAIScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "ai", text: "Ask me about crops, regions, water needs, risk, or a farm plan. I will structure the answer for decision-making." },
  ]);
  const saveItem = useSavedStore((state) => state.saveItem);
  const mutation = useMutation({
    mutationFn: (message: string) => askAI(message),
    onSuccess: (response) => {
      setMessages((items) => [
        ...items,
        { id: `ai-${Date.now()}`, role: "ai", text: response.recommendation, response },
      ]);
    },
  });
  const context = useMemo(() => messages.findLast?.((message) => message.response?.context)?.response?.context, [messages]);

  function submit(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((items) => [...items, { id: `user-${Date.now()}`, role: "user", text: trimmed }]);
    mutation.mutate(trimmed);
  }

  return (
    <Screen>
      <SectionHeader title="Ask Kilimo AI" />
      <OfflineIndicator />
      <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line, ...shadows.card }}>
        <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Agricultural context</Text>
        {context?.crop || context?.region ? (
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {context.crop ? <InfoPill label={`Crop: ${context.crop}`} /> : null}
            {context.region ? <InfoPill label={`Region: ${context.region}`} /> : null}
          </View>
        ) : (
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>Ask about a crop or region and Kilimo AI will attach context for better recommendations.</Text>
        )}
      </View>
      <SuggestedPromptChips prompts={prompts} onPress={submit} />
      <View style={{ gap: 12 }}>
        {messages.map((message) => (
          <View key={message.id} style={{ gap: 8 }}>
            <ChatMessageBubble role={message.role}>{message.text}</ChatMessageBubble>
            {message.response ? (
              <View style={{ backgroundColor: colors.white, borderRadius: 22, padding: 14, gap: 10, borderWidth: 1, borderColor: colors.line }}>
                <InfoPill label={`Suitability: ${message.response.suitability ?? "Contextual"}`} />
                <Text selectable style={{ color: colors.text, fontWeight: "900" }}>Recommendation</Text>
                <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{message.response.recommendedItems.join(", ")}</Text>
                <Text selectable style={{ color: colors.text, fontWeight: "900" }}>Why</Text>
                <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{message.response.why}</Text>
                <Text selectable style={{ color: colors.warning, fontWeight: "900" }}>Warning</Text>
                <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>{message.response.warning}</Text>
                <Text selectable style={{ color: colors.text, fontWeight: "900" }}>Next steps</Text>
                {message.response.nextSteps.map((step) => <Text selectable key={step} style={{ color: colors.muted }}>- {step}</Text>)}
                <SecondaryButton label="Save AI answer" onPress={() => saveItem({ type: "AI Advice", title: message.response?.recommendation ?? "AI advice", subtitle: message.response?.recommendedItems.join(", "), payload: message.response })} />
              </View>
            ) : null}
          </View>
        ))}
        {mutation.isPending ? <LoadingState label="Kilimo AI is thinking..." /> : null}
      </View>
      <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 10, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: colors.line }}>
        <TextInput value={input} onChangeText={setInput} placeholder="Ask about crops, locations, climate..." placeholderTextColor={colors.muted} style={{ flex: 1, minHeight: 44, color: colors.text, fontWeight: "700", paddingHorizontal: 8 }} />
        <Pressable onPress={() => submit()} style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
          <Send stroke={colors.white} size={19} />
        </Pressable>
        <Pressable onPress={() => setMessages([])} style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: colors.softGreen, alignItems: "center", justifyContent: "center" }}>
          <Trash2 stroke={colors.primary} size={18} />
        </Pressable>
      </View>
    </Screen>
  );
}

