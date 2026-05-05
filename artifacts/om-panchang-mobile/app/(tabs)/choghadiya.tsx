import React, { useMemo, useState, useEffect } from "react";
import {
  Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useCity } from "@/contexts/CityContext";
import { computeDayPanchang } from "@/lib/panchangData";
import { computeChoghadiya, getUtcOffsetHours, type ChoghadiyaSlot } from "@/lib/choghadiya";
import { useColors } from "@/hooks/useColors";

const QUALITY_COLORS = {
  good:    { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", badge: "#10B981" },
  neutral: { bg: "#EFF6FF", text: "#1E40AF", border: "#93C5FD", badge: "#3B82F6" },
  bad:     { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", badge: "#EF4444" },
};

const QUALITY_ICONS: Record<"good" | "neutral" | "bad", string> = {
  good: "✨",
  neutral: "🚗",
  bad: "⚠️",
};

const CHOGHADIYA_ICONS: Record<string, string> = {
  Amrit: "💧",
  Shubh: "✨",
  Labh:  "💰",
  Char:  "🚗",
  Udveg: "😟",
  Rog:   "🤒",
  Kaal:  "⏳",
};

export default function ChoghadiyaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useCity();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<"day" | "night">("day");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const today = useMemo(() => new Date(), []);

  const panchang = useMemo(
    () => computeDayPanchang(today, selectedCity),
    [today, selectedCity]
  );

  const choghadiya = useMemo(() => {
    if (!panchang.sunrise || !panchang.sunset) return null;
    const offset = getUtcOffsetHours(selectedCity.timezone);
    return computeChoghadiya(today, panchang.sunrise, panchang.sunset, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panchang, today, selectedCity, tick]);

  const slots = activeTab === "day" ? choghadiya?.day : choghadiya?.night;
  const current = choghadiya?.currentSlot;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>⏱️ Choghadiya</Text>
        <Text style={styles.headerSub}>
          Auspicious time periods · {selectedCity.name}
        </Text>

        {current && (
          <View style={[styles.currentBadge, {
            backgroundColor: QUALITY_COLORS[current.quality].badge + "33",
            borderColor: QUALITY_COLORS[current.quality].badge + "66",
          }]}>
            <Text style={styles.currentLabel}>Now: </Text>
            <Text style={styles.currentName}>
              {CHOGHADIYA_ICONS[current.name]} {current.name}
            </Text>
            <Text style={styles.currentTime}>  {current.start} – {current.end}</Text>
          </View>
        )}
      </LinearGradient>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["day", "night"] as const).map(tab => (
          <Pressable
            key={tab}
            style={[
              styles.tabBtn,
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabLabel,
              { color: activeTab === tab ? colors.primary : colors.mutedForeground },
            ]}>
              {tab === "day" ? "☀️ Day" : "🌙 Night"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.legendRow]}>
          {(["good", "neutral", "bad"] as const).map(q => (
            <View key={q} style={[styles.legendItem, { backgroundColor: QUALITY_COLORS[q].bg, borderColor: QUALITY_COLORS[q].border, borderWidth: 1, borderRadius: 8 }]}>
              <Text style={styles.legendIcon}>{QUALITY_ICONS[q]}</Text>
              <Text style={[styles.legendLabel, { color: QUALITY_COLORS[q].text }]}>
                {q === "good" ? "Auspicious" : q === "neutral" ? "Neutral" : "Inauspicious"}
              </Text>
            </View>
          ))}
        </View>

        {slots?.map((slot, i) => (
          <SlotCard key={i} slot={slot} colors={colors} />
        ))}

        <View style={[styles.infoBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Choghadiya divides the day & night into 8 equal periods. Times are calculated from sunrise to sunset for {selectedCity.name}.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SlotCard({ slot, colors }: { slot: ChoghadiyaSlot; colors: ReturnType<typeof useColors> }) {
  const qc = QUALITY_COLORS[slot.quality];
  const icon = CHOGHADIYA_ICONS[slot.name] ?? "🕐";

  return (
    <View style={[
      styles.slotCard,
      {
        backgroundColor: slot.isCurrent ? qc.bg : colors.card,
        borderColor: slot.isCurrent ? qc.border : colors.border,
        borderWidth: slot.isCurrent ? 1.5 : 1,
      },
    ]}>
      {slot.isCurrent && (
        <View style={[styles.nowTag, { backgroundColor: qc.badge }]}>
          <Text style={styles.nowTagText}>NOW</Text>
        </View>
      )}
      <View style={styles.slotLeft}>
        <Text style={styles.slotIcon}>{icon}</Text>
        <View>
          <Text style={[styles.slotName, { color: slot.isCurrent ? qc.text : colors.foreground }]}>
            {slot.name}
          </Text>
          <Text style={[styles.slotMeaning, { color: colors.mutedForeground }]} numberOfLines={1}>
            {slot.meaning}
          </Text>
        </View>
      </View>
      <View style={styles.slotRight}>
        <Text style={[styles.slotTime, { color: slot.isCurrent ? qc.text : colors.foreground }]}>
          {slot.start}
        </Text>
        <Text style={[styles.slotTimeSep, { color: colors.mutedForeground }]}>to</Text>
        <Text style={[styles.slotTime, { color: slot.isCurrent ? qc.text : colors.foreground }]}>
          {slot.end}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, color: "#C7D2FE", marginTop: 2, fontFamily: "Inter_400Regular" },
  currentBadge: {
    flexDirection: "row", alignItems: "center", marginTop: 10,
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6,
    alignSelf: "flex-start",
  },
  currentLabel: { color: "#E0E7FF", fontSize: 12, fontFamily: "Inter_500Medium" },
  currentName: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_700Bold" },
  currentTime: { color: "#C7D2FE", fontSize: 12, fontFamily: "Inter_400Regular" },
  tabRow: {
    flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabBtn: {
    flex: 1, paddingVertical: 12, alignItems: "center",
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  content: { padding: 14, gap: 10 },
  legendRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  legendItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingHorizontal: 8 },
  legendIcon: { fontSize: 13 },
  legendLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  slotCard: {
    borderRadius: 14, padding: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    overflow: "hidden",
  },
  slotLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  slotIcon: { fontSize: 22, width: 32, textAlign: "center" },
  slotName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  slotMeaning: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  slotRight: { alignItems: "flex-end", gap: 1 },
  slotTime: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  slotTimeSep: { fontSize: 10, fontFamily: "Inter_400Regular" },
  nowTag: {
    position: "absolute", top: 0, right: 0,
    paddingHorizontal: 8, paddingVertical: 3,
    borderBottomLeftRadius: 8,
  },
  nowTagText: { color: "#FFFFFF", fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  infoBox: { borderRadius: 12, borderWidth: 1, padding: 12, marginTop: 4 },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, textAlign: "center" },
});
