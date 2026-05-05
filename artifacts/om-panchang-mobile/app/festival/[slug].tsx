import React from "react";
import {
  Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { getFestivalBySlug, getNextOccurrence } from "@/lib/festivalsData";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr + "T00:00:00").getTime() - today.getTime()) / 86400000);
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  major:    { bg: "#FEF3C7", text: "#92400E" },
  vrat:     { bg: "#EDE9FE", text: "#5B21B6" },
  regional: { bg: "#DCFCE7", text: "#166534" },
};

export default function FestivalDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const festival = getFestivalBySlug(slug ?? "");

  if (!festival) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.foreground, fontSize: 16 }}>Festival not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const occurrence = getNextOccurrence(festival);
  const days = occurrence ? daysUntil(occurrence.date) : null;
  const catColor = CATEGORY_COLORS[festival.category] ?? CATEGORY_COLORS.major;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
          <Text style={styles.backLabel}>Festivals</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{festival.name}</Text>
        <Text style={styles.headerSanskrit}>{festival.sanskrit}</Text>
        {festival.alsoKnownAs && (
          <Text style={styles.headerAka}>Also: {festival.alsoKnownAs.join(" · ")}</Text>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Next Date + Muhurat */}
        {occurrence && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.dateRow}>
              <View style={styles.dateBlock}>
                <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>Next Date</Text>
                <Text style={[styles.dateValue, { color: colors.foreground }]}>{formatDate(occurrence.date)}</Text>
                {occurrence.endDate && (
                  <Text style={[styles.dateEnd, { color: colors.mutedForeground }]}>
                    to {formatDate(occurrence.endDate)}
                  </Text>
                )}
              </View>
              {days !== null && (
                <View style={[styles.daysBadge, {
                  backgroundColor: days === 0 ? "#10B981" : days <= 30 ? colors.primary : colors.muted,
                }]}>
                  <Text style={[styles.daysNum, { color: days <= 30 ? "#FFFFFF" : colors.foreground }]}>
                    {days === 0 ? "Today" : `${days}`}
                  </Text>
                  {days > 0 && (
                    <Text style={[styles.daysSuffix, { color: days <= 30 ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
                      days
                    </Text>
                  )}
                </View>
              )}
            </View>

            {occurrence.muhurat && occurrence.muhurat.length > 0 && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.subSectionTitle, { color: colors.primary }]}>Muhurat Timings</Text>
                {occurrence.muhurat.map((m, i) => (
                  <View key={i} style={styles.muhuratRow}>
                    <Feather name="clock" size={13} color={colors.primary} />
                    <View style={styles.muhuratText}>
                      <Text style={[styles.muhuratLabel, { color: colors.foreground }]}>{m.label}</Text>
                      <Text style={[styles.muhuratTime, { color: colors.mutedForeground }]}>{m.time}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            <View style={styles.metaRow}>
              <View style={[styles.categoryBadge, { backgroundColor: catColor.bg }]}>
                <Text style={[styles.categoryText, { color: catColor.text }]}>
                  {festival.category.charAt(0).toUpperCase() + festival.category.slice(1)}
                </Text>
              </View>
              <Text style={[styles.deityText, { color: colors.mutedForeground }]}>
                🙏 {festival.deity}
              </Text>
            </View>
          </View>
        )}

        {/* Short Description */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>About</Text>
          <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{festival.shortDescription}</Text>
        </View>

        {/* Significance */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>✨ Significance</Text>
          <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{festival.significance}</Text>
        </View>

        {/* Story */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>📖 Story & Legend</Text>
          <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{festival.story}</Text>
        </View>

        {/* Rituals */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>🪔 Rituals</Text>
          {festival.rituals.map((r, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>{r}</Text>
            </View>
          ))}
        </View>

        {/* Fasting */}
        {festival.fasting && (
          <View style={[styles.card, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}>
            <Text style={[styles.sectionTitle, { color: "#92400E" }]}>🍃 Fasting Rules</Text>
            <Text style={[styles.bodyText, { color: "#78350F" }]}>{festival.fasting}</Text>
          </View>
        )}

        {/* What to Offer */}
        {festival.whatToOffer && festival.whatToOffer.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🌸 What to Offer</Text>
            <View style={styles.chipWrap}>
              {festival.whatToOffer.map((item, i) => (
                <View key={i} style={[styles.chip, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <Text style={[styles.chipText, { color: colors.foreground }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mantras */}
        {festival.mantras && festival.mantras.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🕉️ Mantras</Text>
            {festival.mantras.map((m, i) => (
              <View key={i} style={[styles.mantraBlock, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.mantraSanskrit, { color: colors.foreground }]}>{m.sanskrit}</Text>
                <Text style={[styles.mantraMeaning, { color: colors.mutedForeground }]}>{m.meaning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Do and Don't */}
        {festival.doAndDont && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>✅ Do's & Don'ts</Text>
            <Text style={[styles.subSectionTitle, { color: "#059669", marginBottom: 6 }]}>Do</Text>
            {festival.doAndDont.do.map((d, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: "#059669" }]}>✓</Text>
                <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>{d}</Text>
              </View>
            ))}
            <Text style={[styles.subSectionTitle, { color: "#DC2626", marginTop: 10, marginBottom: 6 }]}>Don't</Text>
            {festival.doAndDont.dont.map((d, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: "#DC2626" }]}>✗</Text>
                <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>{d}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Regional Names */}
        {festival.regionalNames && festival.regionalNames.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🗺️ Regional Names</Text>
            {festival.regionalNames.map((r, i) => (
              <View key={i} style={styles.regionalRow}>
                <Text style={[styles.regionalRegion, { color: colors.primary }]}>{r.region}</Text>
                <Text style={[styles.regionalName, { color: colors.foreground }]}>{r.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Related Festivals */}
        {festival.related.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Related Festivals</Text>
            <View style={styles.chipWrap}>
              {festival.related.map(slug => {
                const rel = getFestivalBySlug(slug);
                if (!rel) return null;
                return (
                  <Pressable
                    key={slug}
                    style={[styles.chip, styles.chipPressable, { backgroundColor: colors.muted, borderColor: colors.border }]}
                    onPress={() => router.replace(`/festival/${slug}`)}
                  >
                    <Text style={[styles.chipText, { color: colors.primary }]}>{rel.name}</Text>
                    <Feather name="chevron-right" size={11} color={colors.primary} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 18 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  backLabel: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_500Medium" },
  headerTitle: { color: "#FFFFFF", fontSize: 24, fontFamily: "Inter_700Bold" },
  headerSanskrit: { color: "#C7D2FE", fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 2 },
  headerAka: { color: "#A5B4FC", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  subSectionTitle: { fontSize: 12, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  bodyText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  dateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dateBlock: { flex: 1 },
  dateLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  dateValue: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 2 },
  dateEnd: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  daysBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", minWidth: 56 },
  daysNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  daysSuffix: { fontSize: 10, fontFamily: "Inter_400Regular" },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 2 },
  muhuratRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 4 },
  muhuratText: { flex: 1 },
  muhuratLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  muhuratTime: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 4 },
  categoryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  deityText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bullet: { fontSize: 14, fontFamily: "Inter_700Bold", lineHeight: 21, width: 14 },
  bulletText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  chipPressable: { flexDirection: "row", alignItems: "center", gap: 4 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  mantraBlock: { borderRadius: 10, borderWidth: 1, padding: 12, gap: 6 },
  mantraSanskrit: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 22 },
  mantraMeaning: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, fontStyle: "italic" },
  regionalRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  regionalRegion: { fontSize: 12, fontFamily: "Inter_700Bold", width: 100 },
  regionalName: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
});
