import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useCity } from "@/contexts/CityContext";
import { computeDayPanchang } from "@/lib/panchangData";
import { computeChoghadiya, getUtcOffsetHours, type ChoghadiyaSlot } from "@/lib/choghadiya";
import { useColors } from "@/hooks/useColors";
import { MonthCardList } from "@/components/MonthCardList";

export default function MuhurtaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useCity();
  const [showDay, setShowDay] = useState(true);
  const today = useMemo(() => new Date(), []);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const panchang = useMemo(() => computeDayPanchang(today, selectedCity), [today, selectedCity]);
  const utcOffset = useMemo(() => getUtcOffsetHours(selectedCity.timezone), [selectedCity]);
  const choghadiya = useMemo(() =>
    computeChoghadiya(today, panchang.sunrise, panchang.sunset, utcOffset),
    [today, panchang, utcOffset]
  );

  const slots = showDay ? choghadiya.day : choghadiya.night;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>⏰ Choghadiya</Text>
        <Text style={styles.headerSub}>Auspicious Time Finder — {selectedCity.name}</Text>
        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleBtn, showDay && styles.toggleBtnActive]}
            onPress={() => setShowDay(true)}
          >
            <Text style={[styles.toggleText, showDay && styles.toggleTextActive]}>Day</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, !showDay && styles.toggleBtnActive]}
            onPress={() => setShowDay(false)}
          >
            <Text style={[styles.toggleText, !showDay && styles.toggleTextActive]}>Night</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        {choghadiya.currentSlot && (
          <View style={[styles.currentCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.currentLabel}>Current Choghadiya</Text>
            <Text style={styles.currentName}>{choghadiya.currentSlot.name}</Text>
            <Text style={styles.currentTime}>{choghadiya.currentSlot.start} – {choghadiya.currentSlot.end}</Text>
            <Text style={styles.currentMeaning}>{choghadiya.currentSlot.meaning}</Text>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {slots.map((slot, idx) => (
            <SlotRow key={idx} slot={slot} colors={colors} isLast={idx === slots.length - 1} />
          ))}
        </View>

        <View style={styles.monthHeader}>
          <Text style={[styles.monthTitle, { color: colors.primary }]}>30-DAY MUHURTA CALENDAR</Text>
          <Text style={[styles.monthSub, { color: colors.mutedForeground }]}>
            Daily Rahu Kalam, Abhijit &amp; Brahma Muhurta for {selectedCity.name}
          </Text>
        </View>
        <MonthCardList city={selectedCity} mode="muhurta" />

        <View style={[styles.legendCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.legendTitle, { color: colors.foreground }]}>Legend</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#16A34A" }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Amrit, Shubh, Labh — Auspicious</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#EAB308" }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Char — Neutral (good for travel)</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Udveg, Rog, Kaal — Inauspicious</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CHOGHADIYA_EMOJI: Record<string, string> = {
  Amrit: "🍯", Shubh: "✨", Labh: "💰", Char: "🚶",
  Udveg: "⚠️", Rog: "🤒", Kaal: "☠️",
};

function SlotRow({ slot, colors, isLast }: { slot: ChoghadiyaSlot; colors: ReturnType<typeof useColors>; isLast: boolean }) {
  const dotColor = slot.quality === "good" ? "#16A34A" : slot.quality === "neutral" ? "#EAB308" : "#EF4444";
  const bg = slot.isCurrent ? (slot.quality === "good" ? "#F0FDF4" : slot.quality === "neutral" ? "#FEFCE8" : "#FEF2F2") : "transparent";
  const emoji = CHOGHADIYA_EMOJI[slot.name] ?? "⏱️";

  return (
    <View style={[styles.slotRow, { borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth, borderBottomColor: colors.border, backgroundColor: bg }]}>
      <Text style={styles.slotEmoji}>{emoji}</Text>
      <View style={[styles.slotDot, { backgroundColor: dotColor }]} />
      <View style={styles.slotLeft}>
        <View style={styles.slotNameRow}>
          <Text style={[styles.slotName, { color: colors.foreground }]}>{slot.name}</Text>
          {slot.isCurrent && <View style={[styles.nowBadge, { backgroundColor: colors.primary }]}><Text style={styles.nowText}>NOW</Text></View>}
        </View>
        <Text style={[styles.slotMeaning, { color: colors.mutedForeground }]}>{slot.meaning}</Text>
      </View>
      <Text style={[styles.slotTime, { color: colors.mutedForeground }]}>{slot.start}{"\n"}{slot.end}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, color: "#C7D2FE", marginTop: 2, marginBottom: 12, fontFamily: "Inter_400Regular" },
  toggle: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 3, alignSelf: "flex-start" },
  toggleBtn: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: "rgba(255,255,255,0.9)" },
  toggleText: { fontSize: 14, color: "#C7D2FE", fontFamily: "Inter_600SemiBold" },
  toggleTextActive: { color: "#312E81" },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  currentCard: { borderRadius: 16, padding: 16 },
  currentLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Inter_600SemiBold" },
  currentName: { fontSize: 26, fontWeight: "700", color: "#FFFFFF", marginTop: 4, fontFamily: "Inter_700Bold" },
  currentTime: { fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 2, fontFamily: "Inter_500Medium" },
  currentMeaning: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  slotRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  slotEmoji: { fontSize: 20 },
  slotDot: { width: 10, height: 10, borderRadius: 5 },
  slotLeft: { flex: 1 },
  slotNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  slotName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  nowBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  nowText: { fontSize: 10, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  slotMeaning: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" },
  slotTime: { fontSize: 12, textAlign: "right", fontFamily: "Inter_500Medium", lineHeight: 16 },
  legendCard: { borderRadius: 12, padding: 14, gap: 8 },
  legendTitle: { fontSize: 13, fontFamily: "Inter_700Bold", marginBottom: 4 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  monthHeader: { marginTop: 8, marginBottom: 6, paddingHorizontal: 4 },
  monthTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1, fontFamily: "Inter_700Bold" },
  monthSub: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" },
});
