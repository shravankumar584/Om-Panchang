import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { getUpcomingFestivals } from "@/lib/panchangData";
import { useColors } from "@/hooks/useColors";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatFestDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

const FESTIVAL_EMOJI: Record<string, string> = {
  "Makar Sankranti": "🪁", "Pongal": "🍚", "Vasant Panchami": "🌸",
  "Maha Shivaratri": "🔱", "Holika Dahan": "🔥", "Holi": "🎨",
  "Ugadi": "🌿", "Gudi Padwa": "🪔", "Ram Navami": "🏹",
  "Hanuman Jayanti": "🙏", "Tamil New Year": "🌺", "Vishu": "🌼",
  "Baisakhi": "🌾", "Akshaya Tritiya": "💛", "Vat Savitri": "🌳",
  "Guru Purnima": "📿", "Rath Yatra": "🎡", "Naga Panchami": "🐍",
  "Raksha Bandhan": "🎀", "Krishna Janmashtami": "🎶", "Ganesh Chaturthi": "🐘",
  "Onam": "🌸", "Navratri": "💃", "Dussehra": "🎯",
  "Karva Chauth": "🌙", "Diwali": "🪔", "Govardhan Puja": "🌿",
  "Bhai Dooj": "❤️", "Chhath Puja": "🌅", "Dev Uthani Ekadashi": "🛐",
  "Christmas": "⭐",
};

function getFestivalEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(FESTIVAL_EMOJI)) {
    if (name.includes(key)) return emoji;
  }
  return "🎉";
}

export default function FestivalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const today = useMemo(() => new Date(), []);
  const festivals = useMemo(() => getUpcomingFestivals(today, 30), [today]);

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayFests = festivals.filter(f => f.dateStr === todayKey);
  const upcoming = festivals.filter(f => f.dateStr !== todayKey);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>🎉 Festivals & Vrats</Text>
        <Text style={styles.headerSub}>Upcoming Hindu celebrations</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        {todayFests.length > 0 && (
          <>
            <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Today</Text>
            {todayFests.map((f, i) => (
              <TodayFestCard key={i} names={f.names} />
            ))}
          </>
        )}

        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Upcoming</Text>
        {upcoming.map((f, i) => (
          <FestCard key={i} dateStr={f.dateStr} names={f.names} daysLeft={f.daysLeft} colors={colors} />
        ))}
      </ScrollView>
    </View>
  );
}

function TodayFestCard({ names }: { names: string[] }) {
  const emoji = getFestivalEmoji(names[0] ?? "");
  return (
    <View style={[styles.todayCard, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}>
      <View style={[styles.todayIcon, { backgroundColor: "#F59E0B" }]}>
        <Text style={styles.todayEmoji}>{emoji}</Text>
      </View>
      <View style={styles.cardContent}>
        {names.map((name, i) => (
          <Text key={i} style={[styles.festName, { color: "#92400E", fontSize: 16 }]}>{name}</Text>
        ))}
        <Text style={{ color: "#B45309", fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 }}>Today</Text>
      </View>
    </View>
  );
}

function FestCard({ dateStr, names, daysLeft, colors }: { dateStr: string; names: string[]; daysLeft: number; colors: ReturnType<typeof useColors> }) {
  const emoji = getFestivalEmoji(names[0] ?? "");
  const isClose = daysLeft <= 7;

  return (
    <View style={[styles.festCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.festIcon, { backgroundColor: isClose ? "#EEF2FF" : colors.muted }]}>
        <Text style={styles.festEmoji}>{emoji}</Text>
      </View>
      <View style={styles.cardContent}>
        {names.map((name, i) => (
          <Text key={i} style={[styles.festName, { color: colors.foreground }]}>{name}</Text>
        ))}
        <Text style={[styles.festDate, { color: colors.mutedForeground }]}>{formatFestDate(dateStr)}</Text>
      </View>
      <View style={[styles.daysBadge, { backgroundColor: isClose ? colors.primary : colors.muted }]}>
        <Text style={[styles.daysNum, { color: isClose ? "#FFFFFF" : colors.foreground }]}>{daysLeft}</Text>
        <Text style={[styles.daysSuffix, { color: isClose ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>days</Text>
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
  content: { padding: 16, gap: 10 },
  groupLabel: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 1, marginTop: 4, marginBottom: 2 },
  todayCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  todayIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  todayEmoji: { fontSize: 24 },
  festCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  festIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  festEmoji: { fontSize: 24 },
  cardContent: { flex: 1 },
  festName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  festDate: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  daysBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: "center", minWidth: 48 },
  daysNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  daysSuffix: { fontSize: 10, fontFamily: "Inter_400Regular" },
});
