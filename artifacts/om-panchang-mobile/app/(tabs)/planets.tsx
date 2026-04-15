import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { getPlanetaryPositions, type PlanetPosition } from "@/lib/panchangData";
import { useColors } from "@/hooks/useColors";

export default function PlanetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const today = useMemo(() => new Date(), []);
  const planets = useMemo(() => getPlanetaryPositions(today), [today]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>Navagraha</Text>
        <Text style={styles.headerSub}>Planetary positions in Sidereal zodiac</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {planets.map((planet, idx) => (
            <PlanetRow key={planet.name} planet={planet} colors={colors} isLast={idx === planets.length - 1} />
          ))}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.infoTitle, { color: colors.foreground }]}>About Vedic Astronomy</Text>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Planetary positions are calculated in the Sidereal (Nirayana) zodiac using the Lahiri Ayanamsa to correct for the precession of equinoxes. The nine Navagrahas influence auspicious periods, dashas, and life events in Vedic astrology.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function PlanetRow({ planet, colors, isLast }: { planet: PlanetPosition; colors: ReturnType<typeof useColors>; isLast: boolean }) {
  const deg = Math.floor(planet.degInSign);
  const min = Math.round((planet.degInSign - deg) * 60);

  return (
    <View style={[styles.planetRow, { borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <View style={[styles.symbolContainer, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.symbol, { color: colors.primary }]}>{planet.symbol}</Text>
      </View>
      <View style={styles.planetInfo}>
        <View style={styles.planetNameRow}>
          <Text style={[styles.planetName, { color: colors.foreground }]}>{planet.name}</Text>
          <Text style={[styles.planetNameEn, { color: colors.mutedForeground }]}>{planet.nameEn}</Text>
        </View>
        <Text style={[styles.zodiac, { color: colors.primary }]}>{planet.zodiacSign} ({planet.zodiacEn})</Text>
      </View>
      <View style={styles.planetRight}>
        <Text style={[styles.degrees, { color: colors.foreground }]}>{deg}° {min}'</Text>
        {planet.isRetrograde && (
          <View style={[styles.retroBadge, { backgroundColor: "#FEE2E2" }]}>
            <Text style={styles.retroText}>℞</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, color: "#C7D2FE", marginTop: 2, fontFamily: "Inter_400Regular" },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  planetRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  symbolContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  symbol: { fontSize: 18, fontFamily: "Inter_700Bold" },
  planetInfo: { flex: 1 },
  planetNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  planetName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  planetNameEn: { fontSize: 12, fontFamily: "Inter_400Regular" },
  zodiac: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 2 },
  planetRight: { alignItems: "flex-end", gap: 4 },
  degrees: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  retroBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  retroText: { fontSize: 11, color: "#DC2626", fontFamily: "Inter_700Bold" },
  infoCard: { borderRadius: 16, padding: 16, gap: 8 },
  infoTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
