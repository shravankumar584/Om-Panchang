import React, { useState } from "react";
import {
  Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { ZODIAC_SIGNS, ELEMENT_COLORS, type ZodiacSign } from "@/lib/horoscopeData";

export default function HoroscopeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [selected, setSelected] = useState<ZodiacSign | null>(null);

  if (selected) {
    return (
      <DetailView
        sign={selected}
        onBack={() => setSelected(null)}
        colors={colors}
        insets={insets}
        topPad={topPad}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>♈ Horoscope</Text>
        <Text style={styles.headerSub}>Vedic Jyotish · 12 Rashis</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          Tap a rashi to learn more
        </Text>
        <View style={styles.grid}>
          {ZODIAC_SIGNS.map(sign => (
            <SignCard
              key={sign.slug}
              sign={sign}
              colors={colors}
              onPress={() => setSelected(sign)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SignCard({ sign, colors, onPress }: {
  sign: ZodiacSign;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const ec = ELEMENT_COLORS[sign.element] ?? { bg: colors.muted, text: colors.foreground, border: colors.border };
  return (
    <Pressable
      style={[styles.signCard, { backgroundColor: ec.bg, borderColor: ec.border }]}
      onPress={onPress}
    >
      <Text style={styles.signSymbol}>{sign.symbol}</Text>
      <Text style={[styles.signEnglish, { color: ec.text }]}>{sign.english}</Text>
      <Text style={[styles.signSanskrit, { color: ec.text + "BB" }]}>{sign.sanskrit}</Text>
      <View style={[styles.elementBadge, { backgroundColor: ec.text + "18" }]}>
        <Text style={[styles.elementLabel, { color: ec.text }]}>{sign.element}</Text>
      </View>
    </Pressable>
  );
}

function DetailView({ sign, onBack, colors, insets, topPad }: {
  sign: ZodiacSign;
  onBack: () => void;
  colors: ReturnType<typeof useColors>;
  insets: { bottom: number };
  topPad: number;
}) {
  const ec = ELEMENT_COLORS[sign.element] ?? { bg: colors.muted, text: "#1A1A2E", border: colors.border };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
          <Text style={styles.backLabel}>All Signs</Text>
        </Pressable>
        <Text style={styles.detailSymbol}>{sign.symbol}</Text>
        <Text style={styles.headerTitle}>{sign.english} · {sign.sanskrit}</Text>
        <Text style={styles.headerSub}>{sign.dateRange}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.detailCard, { backgroundColor: ec.bg, borderColor: ec.border }]}>
          <Text style={[styles.detailDesc, { color: ec.text }]}>{sign.shortDescription}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InfoRow label="Ruling Planet" value={sign.lord} colors={colors} />
          <InfoRow label="Element" value={sign.element} colors={colors} />
          <InfoRow label="Vedic Dates" value={sign.dateRange} colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Key Traits</Text>
          <View style={styles.traitsRow}>
            {sign.traits.map(trait => (
              <View key={trait} style={[styles.traitBadge, { backgroundColor: ec.bg, borderColor: ec.border }]}>
                <Text style={[styles.traitText, { color: ec.text }]}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, color: "#C7D2FE", marginTop: 2, fontFamily: "Inter_400Regular" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  backLabel: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_500Medium" },
  detailSymbol: { fontSize: 36, marginBottom: 4 },
  scroll: { flex: 1 },
  content: { padding: 14, gap: 12 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center", marginBottom: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  signCard: {
    width: "47%", borderRadius: 16, borderWidth: 1,
    paddingVertical: 14, paddingHorizontal: 10, alignItems: "center", gap: 4,
  },
  signSymbol: { fontSize: 32 },
  signEnglish: { fontSize: 14, fontFamily: "Inter_700Bold" },
  signSanskrit: { fontSize: 11, fontFamily: "Inter_500Medium" },
  elementBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 },
  elementLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  detailCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  detailDesc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardTitle: { fontSize: 13, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  traitsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  traitBadge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  traitText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(148,163,184,0.2)" },
  infoLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  infoValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1, textAlign: "right" },
});
