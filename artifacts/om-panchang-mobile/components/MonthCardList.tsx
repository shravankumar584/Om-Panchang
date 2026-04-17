import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { computeDayPanchang } from "@/lib/panchangData";
import type { City } from "@/lib/panchangData";
import { useColors } from "@/hooks/useColors";

const DAYS_TO_SHOW = 30;
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Mode = "panchang" | "muhurta";

export function MonthCardList({ city, mode }: { city: City; mode: Mode }) {
  const colors = useColors();

  const computed = useMemo(() => {
    const today = new Date();
    const arr: { date: Date; panchang: ReturnType<typeof computeDayPanchang> }[] = [];
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      arr.push({ date: d, panchang: computeDayPanchang(d, city) });
    }
    return arr;
  }, [city]);

  return (
    <View style={styles.list}>
      {computed.map(({ date, panchang }, idx) => {
        const isToday = idx === 0;
        const isSat = date.getDay() === 6;
        const isSun = date.getDay() === 0;
        const dayColor = isSun ? "#EF4444" : isSat ? "#6366F1" : colors.foreground;

        return (
          <View
            key={idx}
            style={[
              styles.card,
              {
                backgroundColor: isToday ? colors.primary + "12" : colors.card,
                borderColor: isToday ? colors.primary : colors.border,
                borderWidth: isToday ? 2 : 1,
              },
            ]}
          >
            <View style={[styles.dateCol, { borderRightColor: colors.border }]}>
              <Text style={[styles.dateNum, { color: dayColor }]}>{date.getDate()}</Text>
              <Text style={[styles.dateMonth, { color: colors.mutedForeground }]}>
                {MONTH_SHORT[date.getMonth()]}
              </Text>
              <Text style={[styles.dateWeekday, { color: dayColor }]}>
                {WEEKDAY_SHORT[date.getDay()]}
              </Text>
              {isToday && (
                <View style={[styles.todayBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.todayText}>TODAY</Text>
                </View>
              )}
            </View>
            <View style={styles.infoCol}>
              {mode === "panchang" ? (
                <>
                  <Row emoji="🌓" label="Tithi" value={panchang.tithi} colors={colors} accent />
                  <Row emoji="⭐" label="Nakshatra" value={panchang.nakshatra} colors={colors} accent />
                  <View style={styles.timeRow}>
                    <View style={styles.timePair}>
                      <Text style={{ fontSize: 12 }}>🌅</Text>
                      <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
                        {panchang.sunrise}
                      </Text>
                    </View>
                    <View style={styles.timePair}>
                      <Text style={{ fontSize: 12 }}>🌇</Text>
                      <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
                        {panchang.sunset}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Row emoji="⚠️" label="Rahu Kalam" value={panchang.rahuKalam} colors={colors} bad />
                  <Row emoji="☠️" label="Yamaganda" value={panchang.yamagandaKalam} colors={colors} bad />
                  <Row emoji="✨" label="Abhijit" value={panchang.abhijitMuhurta} colors={colors} good />
                  <Row emoji="🌅" label="Brahma Muhurta" value={panchang.brahmaMuhurta} colors={colors} good />
                </>
              )}
              {panchang.festivals.length > 0 && (
                <View style={styles.festivalRow}>
                  <Text style={{ fontSize: 12 }}>🎉</Text>
                  <Text style={styles.festivalText} numberOfLines={2}>
                    {panchang.festivals.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Row({
  emoji,
  label,
  value,
  colors,
  accent,
  bad,
  good,
}: {
  emoji?: string;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  accent?: boolean;
  bad?: boolean;
  good?: boolean;
}) {
  const valueColor = bad
    ? "#EF4444"
    : good
    ? "#16A34A"
    : accent
    ? colors.primary
    : colors.foreground;
  return (
    <View style={styles.row}>
      <View style={styles.rowLabelWrap}>
        {emoji && <Text style={styles.rowEmoji}>{emoji}</Text>}
        <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </View>
      <Text style={[styles.rowValue, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    minHeight: 100,
  },
  dateCol: {
    width: 70,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    gap: 1,
  },
  dateNum: { fontSize: 26, fontFamily: "Inter_700Bold", lineHeight: 30 },
  dateMonth: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase" },
  dateWeekday: { fontSize: 10, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  todayBadge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, marginTop: 4 },
  todayText: { fontSize: 8, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  infoCol: { flex: 1, padding: 12, gap: 4, justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  rowLabelWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  rowEmoji: { fontSize: 11 },
  rowLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  rowValue: { fontSize: 12, fontFamily: "Inter_600SemiBold", flexShrink: 1, textAlign: "right" },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4, paddingTop: 4, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E5E7EB" },
  timePair: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  festivalRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, paddingTop: 4, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#FEF3C7" },
  festivalText: { fontSize: 10, color: "#92400E", fontFamily: "Inter_600SemiBold", flex: 1 },
});
