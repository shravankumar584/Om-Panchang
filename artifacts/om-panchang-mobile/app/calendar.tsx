import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Platform, Pressable, ScrollView,
  StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCity } from "@/contexts/CityContext";
import { computeDayPanchang, getFestivalsForDate, type DayPanchang } from "@/lib/panchangData";
import { useColors } from "@/hooks/useColors";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface CalendarDay {
  date: Date;
  panchang: DayPanchang | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  festivals: string[];
}

export default function CalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useCity();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const todayRef = useRef<Date>(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  });
  const today = todayRef.current;

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const daysRef = useRef<CalendarDay[]>([]);
  const fillCancelRef = useRef(false);

  const buildAndFill = useCallback((m: number, y: number) => {
    fillCancelRef.current = true;
    fillCancelRef.current = false;

    const firstDay = new Date(y, m, 1);
    const lastDay  = new Date(y, m + 1, 0);
    const start    = new Date(firstDay);
    start.setDate(start.getDate() - start.getDay());
    const end      = new Date(lastDay);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const skeleton: CalendarDay[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const d = new Date(cur);
      d.setHours(0, 0, 0, 0);
      skeleton.push({
        date: d,
        panchang: null,
        isCurrentMonth: d.getMonth() === m,
        isToday: d.getTime() === today.getTime(),
        festivals: getFestivalsForDate(d),
      });
      cur.setDate(cur.getDate() + 1);
    }
    daysRef.current = skeleton;
    setCalendarDays([...skeleton]);
    setLoading(true);

    const cancelled = { value: false };
    fillCancelRef.current = false;

    const fill = async () => {
      const monthDates = skeleton.filter(d => d.isCurrentMonth).map(d => d.date);
      for (let i = 0; i < monthDates.length; i += 4) {
        if (cancelled.value) return;
        await Promise.all(
          monthDates.slice(i, i + 4).map(async date => {
            if (cancelled.value) return;
            try {
              const p = await new Promise<DayPanchang>(resolve => {
                setTimeout(() => resolve(computeDayPanchang(date, selectedCity)), 0);
              });
              if (cancelled.value) return;
              const targetTime = date.getTime();
              const idx = daysRef.current.findIndex(d => d.date.getTime() === targetTime);
              if (idx !== -1) {
                setCalendarDays(prev => {
                  if (prev.length === 0) return prev;
                  const next = [...prev];
                  if (next[idx] && next[idx].date.getTime() === targetTime) {
                    next[idx] = { ...next[idx], panchang: p };
                  }
                  return next;
                });
              }
            } catch {}
          })
        );
      }
      if (!cancelled.value) setLoading(false);
    };

    fill();
    return () => { cancelled.value = true; };
  }, [selectedCity, today]);

  useEffect(() => {
    const cleanup = buildAndFill(month, year);
    return cleanup;
  }, [month, year, buildAndFill]);

  function navigate(delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDay(null);
    let m = month + delta;
    let y = year;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    setMonth(m);
    setYear(y);
  }

  const isThisMonth = month === today.getMonth() && year === today.getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={styles.navRow}>
          <Pressable style={styles.navBtn} onPress={() => navigate(-1)}>
            <Feather name="chevron-left" size={20} color="#FFFFFF" />
          </Pressable>
          <View style={styles.navCenter}>
            <Text style={styles.navMonth}>{MONTHS[month]} {year}</Text>
            <Text style={styles.navCity}>📍 {selectedCity.name}</Text>
          </View>
          <Pressable style={styles.navBtn} onPress={() => navigate(1)}>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {!isThisMonth && (
          <Pressable
            style={styles.todayChip}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedDay(null);
              setMonth(today.getMonth());
              setYear(today.getFullYear());
            }}
          >
            <Text style={styles.todayChipText}>Go to Today</Text>
          </Pressable>
        )}
      </LinearGradient>

      <View style={[styles.weekRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {WEEKDAYS_SHORT.map((d, i) => (
          <View key={d} style={styles.weekCell}>
            <Text style={[
              styles.weekLabel,
              { color: i === 0 ? "#EF4444" : i === 6 ? "#6366F1" : colors.mutedForeground },
            ]}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar grid */}
        <View style={[styles.grid, { borderColor: colors.border, backgroundColor: colors.card }]}>
          {calendarDays.map((day, idx) => {
            const isSun = day.date.getDay() === 0;
            const isSat = day.date.getDay() === 6;
            const p = day.panchang;
            const isSelected = selectedDay?.date.getTime() === day.date.getTime();

            const tithiEnd = p?.tithiEnd ? `til ${p.tithiEnd}` : "";

            return (
              <Pressable
                key={idx}
                style={[
                  styles.dayCell,
                  { borderColor: colors.border },
                  !day.isCurrentMonth && { opacity: 0.25 },
                  day.isToday && { backgroundColor: "#FFFBEB" },
                  isSelected && { backgroundColor: colors.secondary },
                ]}
                onPress={() => {
                  if (!day.isCurrentMonth) return;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDay(prev =>
                    prev?.date.getTime() === day.date.getTime() ? null : day
                  );
                }}
              >
                {/* Date number */}
                <View style={[
                  styles.dateNumWrap,
                  day.isToday && { backgroundColor: "#F59E0B", borderRadius: 12 },
                ]}>
                  <Text style={[
                    styles.dateNum,
                    { color: day.isToday ? "#FFFFFF" : isSun ? "#EF4444" : isSat ? "#6366F1" : colors.foreground },
                  ]}>
                    {day.date.getDate()}
                  </Text>
                </View>

                {/* Festival dot */}
                {day.festivals.length > 0 && day.isCurrentMonth && (
                  <View style={styles.festDot} />
                )}

                {day.isCurrentMonth && (
                  <>
                    {p ? (
                      <>
                        <Text style={[styles.tithi, { color: colors.primary }]} numberOfLines={1}>
                          {p.tithi}
                        </Text>
                        {tithiEnd !== "" && (
                          <Text style={[styles.tithiEnd, { color: colors.mutedForeground }]} numberOfLines={1}>
                            {tithiEnd}
                          </Text>
                        )}
                        <Text style={[styles.nakshatra, { color: colors.mutedForeground }]} numberOfLines={1}>
                          {p.nakshatra}
                        </Text>
                        {day.festivals.length > 0 && (
                          <Text style={styles.festival} numberOfLines={1}>
                            🎉
                          </Text>
                        )}
                      </>
                    ) : loading ? (
                      <View style={styles.skeletonWrap}>
                        <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
                        <View style={[styles.skeleton, { backgroundColor: colors.border, width: "65%" }]} />
                      </View>
                    ) : null}
                  </>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Legend */}
        <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.festDotLarge, { backgroundColor: "#EF4444" }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Festival</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendText, { color: colors.primary }]}>↑</Text>
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Tithi ends next day</Text>
          </View>
        </View>

        {/* Day detail panel */}
        {selectedDay && selectedDay.panchang && (
          <DayDetailPanel day={selectedDay} city={selectedCity} colors={colors} key={selectedDay.date.getTime()} />
        )}

        {/* Month quick-jump */}
        <MonthQuickJump
          currentMonth={month}
          currentYear={year}
          today={today}
          colors={colors}
          onSelect={(m, y) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedDay(null);
            setMonth(m);
            setYear(y);
          }}
        />
      </ScrollView>

      {loading && (
        <View style={styles.loadingBanner} pointerEvents="none">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.primary }]}>Loading panchang…</Text>
        </View>
      )}
    </View>
  );
}

function DayDetailPanel({ day, colors }: {
  day: CalendarDay;
  city: { timezone: string };
  colors: ReturnType<typeof useColors>;
}) {
  const p = day.panchang!;
  const d = day.date;
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <View style={[styles.detailPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.detailDate, { color: colors.primary }]}>
        {dayNames[d.getDay()]}, {d.getDate()} {monthNames[d.getMonth()]} {d.getFullYear()}
      </Text>

      <View style={styles.detailGrid}>
        <DetailRow icon="🌙" label="Tithi" value={p.tithi} colors={colors} />
        {p.tithiEnd && <DetailRow icon="⏱️" label="Tithi Ends" value={p.tithiEnd} colors={colors} />}
        <DetailRow icon="⭐" label="Nakshatra" value={p.nakshatra} colors={colors} />
        <DetailRow icon="🔆" label="Yoga" value={p.yoga} colors={colors} />
        {p.karana && <DetailRow icon="✦" label="Karana" value={p.karana} colors={colors} />}
        {p.sunrise && <DetailRow icon="🌅" label="Sunrise" value={p.sunrise} colors={colors} />}
        {p.sunset  && <DetailRow icon="🌇" label="Sunset"  value={p.sunset}  colors={colors} />}
        {p.rahuKalam && <DetailRow icon="☠️" label="Rahu Kalam" value={p.rahuKalam} colors={colors} />}
        {p.abhijitMuhurta && <DetailRow icon="✨" label="Abhijit" value={p.abhijitMuhurta} colors={colors} />}
        {p.brahmaMuhurta && <DetailRow icon="🧘" label="Brahma Muhurta" value={p.brahmaMuhurta} colors={colors} />}
      </View>

      {day.festivals.length > 0 && (
        <View style={[styles.detailFests, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Text style={[styles.detailFestTitle, { color: colors.primary }]}>🎉 Festivals</Text>
          {day.festivals.map((f, i) => (
            <Text key={i} style={[styles.detailFestName, { color: colors.foreground }]}>{f}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function DetailRow({ icon, label, value, colors }: {
  icon: string;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function MonthQuickJump({ currentMonth, currentYear, today, colors, onSelect }: {
  currentMonth: number;
  currentYear: number;
  today: Date;
  colors: ReturnType<typeof useColors>;
  onSelect: (month: number, year: number) => void;
}) {
  const YEARS = [today.getFullYear(), today.getFullYear() + 1];

  return (
    <View style={[styles.quickJump, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={styles.quickJumpHeader}
      >
        <Text style={styles.quickJumpTitle}>Browse Months</Text>
      </LinearGradient>
      <View style={styles.quickJumpGrid}>
        {YEARS.flatMap(y =>
          MONTHS_SHORT.map((mn, mi) => {
            const isActive = mi === currentMonth && y === currentYear;
            return (
              <Pressable
                key={`${y}-${mi}`}
                style={[
                  styles.quickJumpCell,
                  { borderColor: colors.border, backgroundColor: colors.muted },
                  isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => onSelect(mi, y)}
              >
                <Text style={[styles.quickJumpMon, { color: isActive ? "#FFFFFF" : colors.foreground }]}>
                  {mn}
                </Text>
                <Text style={[styles.quickJumpYear, { color: isActive ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                  {y}
                </Text>
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  backLabel: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_500Medium" },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  navCenter: { alignItems: "center" },
  navMonth: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  navCity: { color: "#C7D2FE", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  todayChip: { alignSelf: "center", marginTop: 10, backgroundColor: "#F59E0B", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5 },
  todayChipText: { color: "#1E1B4B", fontSize: 12, fontFamily: "Inter_700Bold" },
  weekRow: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  weekCell: { flex: 1, paddingVertical: 8, alignItems: "center" },
  weekLabel: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  scroll: { flex: 1 },
  grid: { margin: 12, borderRadius: 16, borderWidth: 1, overflow: "hidden", flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: "14.2857%",
    minHeight: 88,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 3,
    overflow: "hidden",
  },
  dateNumWrap: { width: 22, height: 22, justifyContent: "center", alignItems: "center", marginBottom: 2 },
  dateNum: { fontSize: 12, fontFamily: "Inter_700Bold" },
  festDot: { position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: 3, backgroundColor: "#EF4444" },
  tithi: { fontSize: 8, fontFamily: "Inter_600SemiBold", lineHeight: 11 },
  tithiEnd: { fontSize: 7, fontFamily: "Inter_400Regular", lineHeight: 10 },
  nakshatra: { fontSize: 7, fontFamily: "Inter_400Regular", lineHeight: 10 },
  festival: { fontSize: 9, lineHeight: 12 },
  skeletonWrap: { gap: 3, marginTop: 2 },
  skeleton: { height: 6, borderRadius: 3, width: "90%", opacity: 0.4 },
  legend: { marginHorizontal: 12, borderRadius: 12, borderWidth: 1, padding: 10, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  festDotLarge: { width: 7, height: 7, borderRadius: 4 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  detailPanel: { margin: 12, marginTop: 0, borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  detailDate: { fontSize: 14, fontFamily: "Inter_700Bold" },
  detailGrid: { gap: 6 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailIcon: { fontSize: 14, width: 20, textAlign: "center" },
  detailLabel: { fontSize: 12, fontFamily: "Inter_500Medium", width: 110 },
  detailValue: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1 },
  detailFests: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 4 },
  detailFestTitle: { fontSize: 12, fontFamily: "Inter_700Bold" },
  detailFestName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  quickJump: { margin: 12, marginTop: 0, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  quickJumpHeader: { paddingHorizontal: 14, paddingVertical: 10 },
  quickJumpTitle: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_700Bold" },
  quickJumpGrid: { flexDirection: "row", flexWrap: "wrap", padding: 10, gap: 8 },
  quickJumpCell: { borderRadius: 10, borderWidth: 1, paddingVertical: 7, paddingHorizontal: 10, alignItems: "center", minWidth: 58 },
  quickJumpMon: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  quickJumpYear: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 1 },
  loadingBanner: { position: "absolute", bottom: 24, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  loadingText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
