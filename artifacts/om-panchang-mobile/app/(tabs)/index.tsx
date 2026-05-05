import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Animated, Linking, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCity } from "@/contexts/CityContext";
import { computeDayPanchang, getUpcomingFestivals, type DayPanchang } from "@/lib/panchangData";
import { getUtcOffsetHours } from "@/lib/choghadiya";
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
          <View style={styles.headerActions}>
            <Pressable
              style={styles.cityButton}
              onPress={() => { setShowCityModal(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Feather name="map-pin" size={12} color="#C7D2FE" />
              <Text style={styles.cityButtonText} numberOfLines={1}>{selectedCity.name}</Text>
              <Feather name="chevron-down" size={12} color="#C7D2FE" />
            </Pressable>
            <Pressable
              style={styles.infoButton}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/about"); }}
            >
              <Feather name="info" size={18} color="#C7D2FE" />
            </Pressable>
          </View>
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

          {panchang && <TodayDeityCard date={today} colors={colors} />}
          {panchang && <EventCountdownCard colors={colors} today={today} />}
          {panchang && (
            <VedicClockCard
              sunrise={panchang.sunrise}
              sunset={panchang.sunset}
              timezone={selectedCity.timezone}
              cityName={selectedCity.name}
              colors={colors}
            />
          )}

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
            <View style={[styles.toolsGrid, { marginTop: 10 }]}>
              <Pressable
                style={[styles.toolCard, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/horoscope"); }}
              >
                <Text style={styles.toolEmoji}>♈</Text>
                <Text style={[styles.toolName, { color: "#92400E" }]}>Horoscope</Text>
                <Text style={[styles.toolDesc, { color: "#B45309" }]}>12 Rashis</Text>
              </Pressable>
              <Pressable
                style={[styles.toolCard, { backgroundColor: "#ECFDF5", borderColor: "#6EE7B7" }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/calendar"); }}
              >
                <Text style={styles.toolEmoji}>📅</Text>
                <Text style={[styles.toolName, { color: "#065F46" }]}>Calendar</Text>
                <Text style={[styles.toolDesc, { color: "#047857" }]}>Month Grid</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.monthHeader}>
            <Text style={[styles.monthTitle, { color: colors.primary }]}>30-DAY PANCHANG</Text>
            <Text style={[styles.monthSub, { color: colors.mutedForeground }]}>Daily Tithi, Nakshatra &amp; Sun timings for {selectedCity.name}</Text>
          </View>
          <MonthCardList city={selectedCity} mode="panchang" />

          <View style={styles.footerLinks}>
            <Pressable onPress={() => router.push("/about")}>
              <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>About</Text>
            </Pressable>
            <Text style={[styles.footerDot, { color: colors.mutedForeground }]}>·</Text>
            <Pressable onPress={() => router.push("/legal")}>
              <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Privacy</Text>
            </Pressable>
            <Text style={[styles.footerDot, { color: colors.mutedForeground }]}>·</Text>
            <Pressable onPress={() => router.push("/legal")}>
              <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Disclaimer</Text>
            </Pressable>
            <Text style={[styles.footerDot, { color: colors.mutedForeground }]}>·</Text>
            <Pressable onPress={() => Linking.openURL("mailto:ompanchang.org@gmail.com")}>
              <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Contact</Text>
            </Pressable>
          </View>
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
            <Text style={styles.locateBtnText}>{detectingLocation ? "Detecting…" : "Use My Location"}</Text>
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

// ─── Today's Deity ───────────────────────────────────────────────────────────

const DEITIES = [
  { name: "Surya",   sanskrit: "सूर्य",   emoji: "☀️", blessing: "Vitality, health and self-confidence",        weekday: "Sunday" },
  { name: "Shiva",   sanskrit: "शिव",     emoji: "🔱", blessing: "Inner peace, transformation and liberation",  weekday: "Monday" },
  { name: "Hanuman", sanskrit: "हनुमान्", emoji: "🙏", blessing: "Courage, strength and devotion",              weekday: "Tuesday" },
  { name: "Ganesha", sanskrit: "गणेश",   emoji: "🐘", blessing: "Removal of obstacles, wisdom and new beginnings", weekday: "Wednesday" },
  { name: "Vishnu",  sanskrit: "विष्णु",  emoji: "🪷", blessing: "Preservation, prosperity and dharma",         weekday: "Thursday" },
  { name: "Lakshmi", sanskrit: "लक्ष्मी", emoji: "💛", blessing: "Wealth, abundance and good fortune",          weekday: "Friday" },
  { name: "Shani",   sanskrit: "शनि",    emoji: "⚖️", blessing: "Discipline, justice and karmic balance",      weekday: "Saturday" },
];

function TodayDeityCard({ date, colors }: { date: Date; colors: ReturnType<typeof useColors> }) {
  const deity = DEITIES[date.getDay()];
  if (!deity) return null;
  return (
    <View style={[styles.deityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.deityLeft}>
        <View style={[styles.deityIconCircle, { backgroundColor: colors.secondary }]}>
          <Text style={styles.deityEmoji}>{deity.emoji}</Text>
        </View>
        <View style={styles.deityInfo}>
          <Text style={[styles.deityLabel, { color: colors.mutedForeground }]}>Today's Deity · {deity.weekday}</Text>
          <Text style={[styles.deityName, { color: colors.foreground }]}>{deity.name}</Text>
          <Text style={[styles.deitySanskrit, { color: colors.mutedForeground }]}>{deity.sanskrit}</Text>
        </View>
      </View>
      <Text style={[styles.deityBlessing, { color: colors.mutedForeground }]}>{deity.blessing}</Text>
    </View>
  );
}

// ─── Event Countdown ─────────────────────────────────────────────────────────

function EventCountdownCard({ colors, today }: { colors: ReturnType<typeof useColors>; today: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number } | null>(null);
  const [festName, setFestName] = useState("");

  useEffect(() => {
    const festivals = getUpcomingFestivals(today, 90);
    const next = festivals.find(f => f.daysLeft > 0);
    if (!next) return;
    setFestName(next.names[0] ?? "");
    const targetDate = new Date(next.dateStr + "T00:00:00");

    function update() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
      setTimeLeft({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
      });
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [today]);

  if (!timeLeft || !festName) return null;

  return (
    <View style={[styles.countdownCard, { backgroundColor: colors.primary }]}>
      <Text style={styles.countdownLabel}>Next Festival</Text>
      <Text style={styles.countdownName}>{festName}</Text>
      <View style={styles.countdownRow}>
        {[
          { val: timeLeft.days,  unit: "Days" },
          { val: timeLeft.hours, unit: "Hrs" },
          { val: timeLeft.mins,  unit: "Min" },
        ].map(({ val, unit }) => (
          <View key={unit} style={styles.countdownBox}>
            <View style={[styles.countdownInner, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={styles.countdownNum}>{String(val).padStart(2, "0")}</Text>
            </View>
            <Text style={styles.countdownUnit}>{unit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Vedic Clock ─────────────────────────────────────────────────────────────

function parseCityTimeMins(timeStr: string): number | null {
  if (!timeStr || timeStr === "N/A") return null;
  const clean = timeStr.replace(/ /g, " ").trim();
  const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/i);
  if (!match) return null;
  let h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const meridiem = (match[3] ?? "AM").toUpperCase();
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function VedicClockCard({ sunrise, sunset, timezone, cityName, colors }: {
  sunrise: string; sunset: string; timezone: string; cityName: string;
  colors: ReturnType<typeof useColors>;
}) {
  const [now, setNow] = useState(() => new Date());
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const cityTimeStr = useMemo(() => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: true, timeZone: timezone,
    }).format(now);
  }, [now, timezone]);

  const { ghati, pal, vipal, percentDay, isDaytime } = useMemo(() => {
    const utcOffset = getUtcOffsetHours(timezone);
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityMs = utcMs + utcOffset * 3600000;
    const cityNow = new Date(cityMs);
    const cityMins = cityNow.getHours() * 60 + cityNow.getMinutes();
    const cityTotalMs = (cityNow.getHours() * 3600 + cityNow.getMinutes() * 60 + cityNow.getSeconds()) * 1000;

    const riseMins = parseCityTimeMins(sunrise);
    const setMins = parseCityTimeMins(sunset);
    if (riseMins == null || setMins == null) {
      return { ghati: "--", pal: "--", vipal: "--", percentDay: 0, isDaytime: false };
    }

    const dayDurMs = (setMins - riseMins) * 60000;
    const elapsedMs = cityTotalMs - riseMins * 60000;
    const clampedElapsed = Math.max(0, Math.min(dayDurMs, elapsedMs));
    const pct = clampedElapsed / dayDurMs;

    const DAY_MS = 24 * 3600000;
    const totalVipal = Math.max(0, Math.round((elapsedMs / DAY_MS) * 216000));
    const g = Math.floor(totalVipal / 3600);
    const p = Math.floor((totalVipal % 3600) / 60);
    const v = totalVipal % 60;

    return {
      ghati: String(g).padStart(2, "0"),
      pal: String(p).padStart(2, "0"),
      vipal: String(v).padStart(2, "0"),
      percentDay: pct,
      isDaytime: cityMins >= riseMins && cityMins < setMins,
    };
  }, [now, sunrise, sunset, timezone]);

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: Math.min(1, percentDay),
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percentDay, barWidth]);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>⏱️ Vedic Time</Text>
      <Text style={[styles.vedicClock, { color: colors.foreground }]}>{cityTimeStr}</Text>
      <Text style={[styles.vedicCity, { color: colors.mutedForeground }]}>{cityName} local time</Text>
      <View style={[styles.ghatiRow, { backgroundColor: colors.secondary }]}>
        {[{ val: ghati, label: "Ghati" }, { val: pal, label: "Pal" }, { val: vipal, label: "Vipal" }].map(({ val, label }, i) => (
          <React.Fragment key={label}>
            {i > 0 && <Text style={[styles.ghatiSep, { color: colors.mutedForeground }]}>:</Text>}
            <View style={styles.ghatiUnit}>
              <Text style={[styles.ghatiNum, { color: colors.primary }]}>{val}</Text>
              <Text style={[styles.ghatiLabel, { color: colors.mutedForeground }]}>{label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      <View style={styles.barWrap}>
        <View style={styles.barRow}>
          <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>🌅 {sunrise}</Text>
          <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>🌇 {sunset}</Text>
        </View>
        <View style={[styles.barTrack, { backgroundColor: colors.muted }]}>
          <Animated.View style={[styles.barFill, {
            width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            backgroundColor: isDaytime ? "#F59E0B" : "#6366F1",
          }]} />
        </View>
      </View>
      <Text style={[styles.ghatiNote, { color: colors.mutedForeground }]}>
        1 Day = 60 Ghati · 1 Ghati = 60 Pal · 1 Pal = 60 Vipal
      </Text>
    </View>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

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
    <View style={styles.row}>
      <View style={styles.rowLeft}><Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text></View>
      <View style={styles.rowRight}>
        <Text style={[styles.value, { color: valueColor }]} numberOfLines={2}>{value}</Text>
        {!!sub && <Text style={[styles.sub, { color: colors.mutedForeground }]}>{sub}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerOm: { fontSize: 28 },
  headerTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "700", fontFamily: "Inter_700Bold" },
  headerDate: { color: "#E0E7FF", fontSize: 14, marginTop: 2, fontFamily: "Inter_500Medium" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  cityButton: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, maxWidth: 140 },
  infoButton: { padding: 4 },
  cityButtonText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  festivalBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, padding: 12 },
  festivalText: { color: "#92400E", fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1 },
  card: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 },
  row: { flexDirection: "row", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "rgba(148,163,184,0.12)" },
  rowLeft: { width: 110, paddingRight: 10 },
  rowRight: { flex: 1, alignItems: "flex-end" },
  label: { fontSize: 12, fontFamily: "Inter_500Medium" },
  value: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  sub: { fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular", textAlign: "right" },
  monthHeader: { marginTop: 8, marginBottom: 2, gap: 2 },
  monthTitle: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold", letterSpacing: 1 },
  monthSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modalContainer: { flex: 1, paddingTop: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingBottom: 14, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: "700", fontFamily: "Inter_700Bold" },
  locateBtn: { marginHorizontal: 18, marginTop: 14, borderRadius: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  locateBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  searchContainer: { flexDirection: "row", alignItems: "center", margin: 18, marginBottom: 0, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  cityRow: { paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cityName: { fontSize: 15, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  cityCountry: { fontSize: 13, marginTop: 2, fontFamily: "Inter_400Regular" },
  toolsGrid: { flexDirection: "row", gap: 10 },
  toolCard: { flex: 1, borderWidth: 1, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 10, alignItems: "center", gap: 4 },
  toolEmoji: { fontSize: 22 },
  toolName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  toolDesc: { fontSize: 12, fontFamily: "Inter_500Medium" },
  // TodayDeity
  deityCard: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 10 },
  deityLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  deityIconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center" },
  deityEmoji: { fontSize: 28 },
  deityInfo: { flex: 1 },
  deityLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  deityName: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 2 },
  deitySanskrit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  deityBlessing: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  // EventCountdown
  countdownCard: { borderRadius: 18, padding: 16, alignItems: "center", gap: 6 },
  countdownLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 2 },
  countdownName: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  countdownRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  countdownBox: { alignItems: "center", gap: 4 },
  countdownInner: { borderRadius: 10, width: 54, height: 54, justifyContent: "center", alignItems: "center" },
  countdownNum: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  countdownUnit: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 1 },
  // VedicClock
  vedicClock: { fontSize: 28, fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: 1 },
  vedicCity: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: -4 },
  ghatiRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, gap: 4 },
  ghatiUnit: { alignItems: "center", flex: 1 },
  ghatiNum: { fontSize: 22, fontFamily: "Inter_700Bold" },
  ghatiLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  ghatiSep: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 10 },
  barWrap: { gap: 6 },
  barRow: { flexDirection: "row", justifyContent: "space-between" },
  barLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  barTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4 },
  ghatiNote: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  footerLinks: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 6, paddingVertical: 8 },
  footerLink: { fontSize: 12, fontFamily: "Inter_500Medium" },
  footerDot: { fontSize: 12 },
});