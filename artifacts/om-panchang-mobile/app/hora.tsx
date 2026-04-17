import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCity } from "@/contexts/CityContext";
import { computeDayPanchang } from "@/lib/panchangData";
import { computeHoraTimings, HoraSlot, PLANET_META, Planet } from "@/lib/horaTimings";
import { useColors } from "@/hooks/useColors";

const PLANETS: Planet[] = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];

function SlotRow({ slot, index }: { slot: HoraSlot; index: number }) {
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: slot.isCurrent ? slot.bgColor : "#fff" },
        slot.isCurrent && { borderColor: slot.color, borderWidth: 1.5 },
      ]}
    >
      <Text style={styles.rowIndex}>{index + 1}</Text>
      <Text style={styles.rowIcon}>{slot.icon}</Text>
      <View style={styles.rowMain}>
        <View style={styles.rowNameLine}>
          <Text style={[styles.rowPlanet, { color: slot.color }]}>{slot.planet}</Text>
          {slot.isCurrent && <Text style={styles.nowBadge}>NOW</Text>}
        </View>
        <Text style={styles.rowDomain} numberOfLines={1}>{slot.domains}</Text>
      </View>
      <View style={styles.rowTimes}>
        <Text style={styles.rowStart}>{slot.start}</Text>
        <Text style={styles.rowEnd}>{slot.end}</Text>
      </View>
    </View>
  );
}

export default function HoraScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { selectedCity } = useCity();
  // Re-tick every minute so the "NOW" highlight stays current.
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const panchang = useMemo(() => computeDayPanchang(today, selectedCity), [today, selectedCity]);
  const hora = useMemo(
    () => computeHoraTimings(today, panchang.sunrise, panchang.sunset, selectedCity.timezone),
    [today, panchang.sunrise, panchang.sunset, selectedCity.timezone],
  );

  const dayLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: selectedCity.timezone, weekday: "short", day: "numeric", month: "short",
      }).format(today);
    } catch {
      return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][today.getDay()]}, ${today.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][today.getMonth()]}`;
    }
  }, [today, selectedCity.timezone]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: "Hora" }} />
      <LinearGradient colors={["#7c3aed", "#4f46e5"]} style={[styles.header, { paddingTop: 16 }]}>
        <Text style={styles.headerEyebrow}>VEDIC PLANETARY HOURS</Text>
        <Text style={styles.headerTitle}>⏳ Hora Timings</Text>
        <Text style={styles.headerSub}>{dayLabel} · 📍 {selectedCity.name}</Text>
        <Text style={styles.headerMeta}>Sunrise {panchang.sunrise} · Sunset {panchang.sunset}</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}>
        {/* Current callout */}
        {hora.currentSlot ? (
          <View style={[styles.currentCard, { backgroundColor: hora.currentSlot.bgColor, borderColor: hora.currentSlot.color }]}>
            <Text style={styles.currentEmoji}>{hora.currentSlot.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.currentLabel}>CURRENT HORA</Text>
              <Text style={[styles.currentPlanet, { color: hora.currentSlot.color }]}>
                {hora.currentSlot.planet} Hora
              </Text>
              <Text style={styles.currentTime}>{hora.currentSlot.start} – {hora.currentSlot.end}</Text>
              <Text style={styles.currentDomain}>{hora.currentSlot.domains}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>Hora applies to the current day. Live highlight resumes on today's date.</Text>
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          {PLANETS.map(p => (
            <View key={p} style={[styles.legendChip, { backgroundColor: PLANET_META[p].bgColor, borderColor: PLANET_META[p].color }]}>
              <Text style={styles.legendIcon}>{PLANET_META[p].icon}</Text>
              <Text style={[styles.legendName, { color: PLANET_META[p].color }]}>{p}</Text>
            </View>
          ))}
        </View>

        {/* Day section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>🌅</Text>
          <View>
            <Text style={[styles.sectionTitle, { color: "#B45309" }]}>Day Horas (12 slots)</Text>
            <Text style={styles.sectionSub}>Sunrise {panchang.sunrise} → Sunset {panchang.sunset}</Text>
          </View>
        </View>
        <View style={styles.listCard}>
          {hora.day.map((s, i) => <SlotRow key={`d${i}`} slot={s} index={i} />)}
        </View>

        {/* Night section */}
        <View style={[styles.sectionHeader, { marginTop: 18 }]}>
          <Text style={styles.sectionEmoji}>🌙</Text>
          <View>
            <Text style={[styles.sectionTitle, { color: "#4338CA" }]}>Night Horas (12 slots)</Text>
            <Text style={styles.sectionSub}>Sunset {panchang.sunset} → next Sunrise</Text>
          </View>
        </View>
        <View style={styles.listCard}>
          {hora.night.map((s, i) => <SlotRow key={`n${i}`} slot={s} index={i} />)}
        </View>

        {/* About */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>🕉️ About Hora</Text>
          <Text style={styles.aboutBody}>
            Each day is divided into 24 planetary hours starting at sunrise. The first hora is ruled by
            the weekday's planet lord, followed by the Chaldean order: Saturn → Jupiter → Mars → Sun →
            Venus → Mercury → Moon. Each planet's hora is favourable for activities aligned with that planet's domain.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 18 },
  headerEyebrow: { color: "#C4B5FD", fontSize: 11, letterSpacing: 1.5, fontFamily: "Inter_600SemiBold" },
  headerTitle: { color: "#fff", fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 2 },
  headerSub: { color: "#DDD6FE", fontSize: 13, marginTop: 4, fontFamily: "Inter_500Medium" },
  headerMeta: { color: "#A78BFA", fontSize: 11, marginTop: 4, fontFamily: "Inter_400Regular" },
  scroll: { flex: 1 },

  currentCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 2, marginBottom: 14,
  },
  currentEmoji: { fontSize: 36 },
  currentLabel: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#64748B", letterSpacing: 1 },
  currentPlanet: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 2 },
  currentTime: { fontSize: 13, color: "#334155", fontFamily: "Inter_600SemiBold" },
  currentDomain: { fontSize: 12, color: "#64748B", marginTop: 2, fontFamily: "Inter_400Regular" },

  noteBox: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: "#E2E8F0" },
  noteText: { fontSize: 12, color: "#64748B", textAlign: "center", fontFamily: "Inter_500Medium" },

  legend: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 18 },
  legendChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  legendIcon: { fontSize: 11 },
  legendName: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8, paddingHorizontal: 4 },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 11, color: "#94A3B8", fontFamily: "Inter_400Regular", marginTop: 1 },

  listCard: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", overflow: "hidden" },
  row: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E2E8F0",
  },
  rowIndex: { fontSize: 10, color: "#94A3B8", width: 18, textAlign: "right", fontFamily: "Inter_500Medium" },
  rowIcon: { fontSize: 18, width: 22, textAlign: "center" },
  rowMain: { flex: 1, minWidth: 0 },
  rowNameLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowPlanet: { fontSize: 14, fontFamily: "Inter_700Bold" },
  nowBadge: {
    fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff",
    backgroundColor: "#4F46E5", paddingHorizontal: 6, paddingVertical: 1.5,
    borderRadius: 6, overflow: "hidden",
  },
  rowDomain: { fontSize: 11, color: "#64748B", marginTop: 1, fontFamily: "Inter_400Regular" },
  rowTimes: { alignItems: "flex-end" },
  rowStart: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#334155" },
  rowEnd: { fontSize: 11, color: "#94A3B8", fontFamily: "Inter_400Regular" },

  aboutBox: { backgroundColor: "#EDE9FE", borderRadius: 12, padding: 14, marginTop: 18, borderWidth: 1, borderColor: "#C4B5FD" },
  aboutTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#5B21B6", marginBottom: 4 },
  aboutBody: { fontSize: 12, color: "#5B21B6", lineHeight: 17, fontFamily: "Inter_400Regular" },
});
