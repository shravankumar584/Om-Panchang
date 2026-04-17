import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCity } from "@/contexts/CityContext";
import { computeDayPanchang, type DayPanchang } from "@/lib/panchangData";
import { useColors } from "@/hooks/useColors";
import { MonthCardList } from "@/components/MonthCardList";
import { router } from "expo-router";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default function TodayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, setCity, cities, detectLocation, detectingLocation } = useCity();
  const [panchang, setPanchang] = useState<DayPanchang | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const result = computeDayPanchang(today, selectedCity);
      setPanchang(result);
      setLoading(false);
    }, 0);
  }, [selectedCity, today]);

  const filteredCities = useMemo(() =>
    cities.filter(c =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearch.toLowerCase())
    ), [cities, citySearch]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerOm}>ॐ</Text>
            <View>
              <Text style={styles.headerTitle}>Om Panchang</Text>
              <Text style={styles.headerDate}>{formatDate(today)}</Text>
            </View>
          </View>
          <Pressable
            style={styles.cityButton}
            onPress={() => { setShowCityModal(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Feather name="map-pin" size={12} color="#C7D2FE" />
            <Text style={styles.cityButtonText} numberOfLines={1}>{selectedCity.name}</Text>
            <Feather name="chevron-down" size={12} color="#C7D2FE" />
          </Pressable>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Computing Panchang…</Text>
        </View>
      ) : panchang ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
          showsVerticalScrollIndicator={false}
        >
          {panchang.festivals.length > 0 && (
            <View style={[styles.festivalBanner, { backgroundColor: "#FEF3C7" }]}>
              <Feather name="star" size={14} color="#D97706" />
              <Text style={styles.festivalText}>{panchang.festivals.join("  •  ")}</Text>
            </View>
          )}

          <SectionCard title="Pancha Anga" colors={colors}>
            <DetailRow label="Tithi" value={panchang.tithi} sub={panchang.tithiEnd ? `Ends ${panchang.tithiEnd}` : undefined} colors={colors} accent />
            <DetailRow label="Nakshatra" value={panchang.nakshatra} colors={colors} accent />
            <DetailRow label="Yoga" value={panchang.yoga} colors={colors} />
            <DetailRow label="Karana" value={panchang.karana} colors={colors} />
            <DetailRow label="Paksha" value={panchang.paksha} colors={colors} />
          </SectionCard>

          <SectionCard title="Astronomical Times" colors={colors}>
            <DetailRow label="Sunrise" value={panchang.sunrise} colors={colors} />
            <DetailRow label="Sunset" value={panchang.sunset} colors={colors} />
            <DetailRow label="Moonrise" value={panchang.moonrise} colors={colors} />
            <DetailRow label="Moonset" value={panchang.moonset} colors={colors} />
          </SectionCard>

          <SectionCard title="Inauspicious Times" colors={colors}>
            <DetailRow label="Rahu Kalam" value={panchang.rahuKalam} colors={colors} bad />
            <DetailRow label="Yamaganda" value={panchang.yamagandaKalam} colors={colors} bad />
            <DetailRow label="Gulika Kalam" value={panchang.gulikaKalam} colors={colors} bad />
          </SectionCard>

          <SectionCard title="Auspicious Times" colors={colors}>
            <DetailRow label="Abhijit Muhurta" value={panchang.abhijitMuhurta} colors={colors} good />
            <DetailRow label="Brahma Muhurta" value={panchang.brahmaMuhurta} colors={colors} good />
          </SectionCard>

          <SectionCard title="Vedic Calendar" colors={colors}>
            <DetailRow label="Weekday" value={panchang.weekdayName} colors={colors} />
            <DetailRow label="Vikram Samvat" value={String(panchang.vikramSamvat)} colors={colors} />
            <DetailRow label="Shaka Samvat" value={String(panchang.shakaSamvat)} colors={colors} />
            <DetailRow label="Ayana" value={panchang.ayana} colors={colors} />
            <DetailRow label="Ritu" value={panchang.ritu} colors={colors} />
          </SectionCard>

          <SectionCard title="Zodiac Signs" colors={colors}>
            <DetailRow label="Sun Sign (Rashi)" value={panchang.sunsign} colors={colors} />
            <DetailRow label="Moon Sign (Rashi)" value={panchang.moonsign} colors={colors} />
          </SectionCard>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Vedic Tools</Text>
            <View style={styles.toolsGrid}>
              <Pressable
                style={[styles.toolCard, { backgroundColor: "#EDE9FE", borderColor: "#C4B5FD" }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/hora"); }}
              >
                <Text style={styles.toolEmoji}>⏳</Text>
                <Text style={[styles.toolName, { color: "#5B21B6" }]}>Hora</Text>
                <Text style={[styles.toolDesc, { color: "#7C3AED" }]}>Planetary Hours</Text>
              </Pressable>
              <Pressable
                style={[styles.toolCard, { backgroundColor: "#E0E7FF", borderColor: "#A5B4FC" }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/kundali"); }}
              >
                <Text style={styles.toolEmoji}>🪷</Text>
                <Text style={[styles.toolName, { color: "#3730A3" }]}>Kundali</Text>
                <Text style={[styles.toolDesc, { color: "#4F46E5" }]}>Birth Chart</Text>
              </Pressable>
              <Pressable
                style={[styles.toolCard, { backgroundColor: "#FCE7F3", borderColor: "#F9A8D4" }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/kundali-milan"); }}
              >
                <Text style={styles.toolEmoji}>💞</Text>
                <Text style={[styles.toolName, { color: "#9D174D" }]}>Milan</Text>
                <Text style={[styles.toolDesc, { color: "#BE185D" }]}>Compatibility</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.monthHeader}>
            <Text style={[styles.monthTitle, { color: colors.primary }]}>30-DAY PANCHANG</Text>
            <Text style={[styles.monthSub, { color: colors.mutedForeground }]}>
              Daily Tithi, Nakshatra &amp; Sun timings for {selectedCity.name}
            </Text>
          </View>
          <MonthCardList city={selectedCity} mode="panchang" />
        </ScrollView>
      ) : null}

      <Modal visible={showCityModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select City</Text>
            <Pressable onPress={() => { setShowCityModal(false); setCitySearch(""); }}>
              <Feather name="x" size={22} color={colors.foreground} />
            </Pressable>
          </View>
          <Pressable
            style={[styles.locateBtn, { backgroundColor: colors.primary }]}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const r = await detectLocation();
              if (r.ok) {
                setShowCityModal(false);
                setCitySearch("");
              } else {
                Alert.alert("Location unavailable", r.message ?? "Please enable location permission in settings.");
              }
            }}
            disabled={detectingLocation}
          >
            {detectingLocation ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="navigation" size={16} color="#FFFFFF" />
            )}
            <Text style={styles.locateBtnText}>
              {detectingLocation ? "Detecting…" : "Use My Location"}
            </Text>
          </Pressable>
          <View style={[styles.searchContainer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search cities…"
              placeholderTextColor={colors.mutedForeground}
              value={citySearch}
              onChangeText={setCitySearch}
              autoFocus
            />
          </View>
          <ScrollView>
            {filteredCities.map(city => (
              <Pressable
                key={city.name}
                style={[
                  styles.cityRow,
                  { borderBottomColor: colors.border },
                  selectedCity.name === city.name && { backgroundColor: colors.secondary }
                ]}
                onPress={() => {
                  setCity(city);
                  setShowCityModal(false);
                  setCitySearch("");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View>
                  <Text style={[styles.cityName, { color: colors.foreground }]}>{city.name}</Text>
                  <Text style={[styles.cityCountry, { color: colors.mutedForeground }]}>{city.country}</Text>
                </View>
                {selectedCity.name === city.name && (
                  <Feather name="check" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function SectionCard({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
      {children}
    </View>
  );
}

function DetailRow({ label, value, sub, colors, accent, bad, good }: {
  label: string; value: string; sub?: string; colors: ReturnType<typeof useColors>;
  accent?: boolean; bad?: boolean; good?: boolean;
}) {
  const valueColor = bad ? "#EF4444" : good ? "#16A34A" : accent ? colors.primary : colors.foreground;
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.detailRight}>
        <Text style={[styles.detailValue, { color: valueColor }]}>{value}</Text>
        {sub && <Text style={[styles.detailSub, { color: colors.mutedForeground }]}>{sub}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerOm: { fontSize: 28, color: "#FBBE23" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  headerDate: { fontSize: 12, color: "#C7D2FE", marginTop: 1, fontFamily: "Inter_400Regular" },
  cityButton: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, maxWidth: 140 },
  cityButtonText: { fontSize: 12, color: "#C7D2FE", fontFamily: "Inter_500Medium", flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  festivalBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, padding: 12 },
  festivalText: { fontSize: 13, color: "#92400E", fontFamily: "Inter_600SemiBold", flex: 1 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 2 },
  sectionTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter_700Bold" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#F0F0F5" },
  detailLabel: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  detailRight: { flex: 1, alignItems: "flex-end" },
  detailValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  detailSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", gap: 10, margin: 16, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  cityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  cityName: { fontSize: 15, fontFamily: "Inter_500Medium" },
  cityCountry: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  locateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 16, marginTop: 12, paddingVertical: 12, borderRadius: 10 },
  locateBtnText: { fontSize: 14, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  toolsGrid: { flexDirection: "row", gap: 8, marginTop: 4 },
  toolCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center" },
  toolEmoji: { fontSize: 28, marginBottom: 4 },
  toolName: { fontSize: 13, fontFamily: "Inter_700Bold" },
  toolDesc: { fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 1 },
  monthHeader: { marginTop: 12, marginBottom: 6, paddingHorizontal: 4 },
  monthTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1, fontFamily: "Inter_700Bold" },
  monthSub: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" },
});
