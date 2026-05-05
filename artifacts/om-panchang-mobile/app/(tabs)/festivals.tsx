import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { getUpcomingFestivals } from "@/lib/panchangData";
import { getUpcomingVrats, VRAT_TYPE_META, type VratEntry } from "@/lib/vratData";
import { getSlugForFestivalName } from "@/lib/festivalsData";
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
  const [activeTab, setActiveTab] = useState<"festivals" | "vrats">("festivals");
  const today = useMemo(() => new Date(), []);

  const festivals = useMemo(() => getUpcomingFestivals(today, 30), [today]);
  const vratsAll = useMemo(() => getUpcomingVrats(today, 40), [today]);

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayFests = festivals.filter(f => f.dateStr === todayKey);
  const upcoming = festivals.filter(f => f.dateStr !== todayKey);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>
          {activeTab === "festivals" ? "🎉 Festivals" : "🕉️ Vrat Calendar"}
        </Text>
        <Text style={styles.headerSub}>
          {activeTab === "festivals"
            ? "Upcoming Hindu celebrations"
            : "Ekadashi, Purnima, Amavasya & more"}
        </Text>
      </LinearGradient>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.tabBtn, activeTab === "festivals" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab("festivals")}
        >
          <Text style={[styles.tabLabel, { color: activeTab === "festivals" ? colors.primary : colors.mutedForeground }]}>
            Festivals
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === "vrats" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab("vrats")}
        >
          <Text style={[styles.tabLabel, { color: activeTab === "vrats" ? colors.primary : colors.mutedForeground }]}>
            Vrat Calendar
          </Text>
        </Pressable>
      </View>

      {activeTab === "festivals" ? (
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
      ) : (
        <VratList vrats={vratsAll} today={todayKey} colors={colors} insets={insets} />
      )}
    </View>
  );
}

function VratList({ vrats, today, colors, insets }: {
  vrats: VratEntry[];
  today: string;
  colors: ReturnType<typeof useColors>;
  insets: { bottom: number };
}) {
  const [filter, setFilter] = useState<VratEntry["type"] | "all">("all");

  const filters: Array<{ key: VratEntry["type"] | "all"; label: string }> = [
    { key: "all", label: "All" },
    { key: "ekadashi", label: "Ekadashi" },
    { key: "purnima", label: "Purnima" },
    { key: "amavasya", label: "Amavasya" },
    { key: "pradosh", label: "Pradosh" },
    { key: "sankashti", label: "Sankashti" },
  ];

  const filtered = filter === "all" ? vrats : vrats.filter(v => v.type === filter);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { borderBottomColor: colors.border }]}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map(f => (
          <Pressable
            key={f.key}
            style={[
              styles.filterChip,
              { borderColor: colors.border, backgroundColor: colors.muted },
              filter === f.key && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[
              styles.filterLabel,
              { color: colors.mutedForeground },
              filter === f.key && { color: "#FFFFFF" },
            ]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((vrat, i) => (
          <VratCard key={i} vrat={vrat} today={today} colors={colors} />
        ))}
        {filtered.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No upcoming vrats found.</Text>
        )}
      </ScrollView>
    </>
  );
}

function VratCard({ vrat, today, colors }: {
  vrat: VratEntry;
  today: string;
  colors: ReturnType<typeof useColors>;
}) {
  const meta = VRAT_TYPE_META[vrat.type];
  const isToday = vrat.date === today;
  const daysLeft = Math.round((new Date(vrat.date).getTime() - new Date(today).getTime()) / 86400000);

  return (
    <View style={[
      styles.vratCard,
      { backgroundColor: vrat.special ? meta.bg : colors.card, borderColor: vrat.special ? meta.border : colors.border },
    ]}>
      <View style={[styles.vratIcon, { backgroundColor: meta.bg }]}>
        <Text style={styles.vratEmoji}>{meta.icon}</Text>
      </View>
      <View style={styles.vratContent}>
        <View style={styles.vratNameRow}>
          <Text style={[styles.vratName, { color: vrat.special ? meta.text : colors.foreground }]} numberOfLines={2}>
            {vrat.name}
          </Text>
          {vrat.special && (
            <View style={[styles.specialBadge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
              <Text style={[styles.specialLabel, { color: meta.text }]}>★ Special</Text>
            </View>
          )}
        </View>
        {vrat.significance && (
          <Text style={[styles.vratSig, { color: colors.mutedForeground }]} numberOfLines={1}>
            {vrat.significance}
          </Text>
        )}
        <Text style={[styles.vratDate, { color: colors.mutedForeground }]}>{formatFestDate(vrat.date)}</Text>
      </View>
      {isToday ? (
        <View style={[styles.daysBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.daysNum, { color: "#FFFFFF" }]}>Today</Text>
        </View>
      ) : (
        <View style={[styles.daysBadge, { backgroundColor: daysLeft <= 7 ? colors.primary : colors.muted }]}>
          <Text style={[styles.daysNum, { color: daysLeft <= 7 ? "#FFFFFF" : colors.foreground }]}>{daysLeft}</Text>
          <Text style={[styles.daysSuffix, { color: daysLeft <= 7 ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>days</Text>
        </View>
      )}
    </View>
  );
}

function TodayFestCard({ names }: { names: string[] }) {
  const emoji = getFestivalEmoji(names[0] ?? "");
  const slug = getSlugForFestivalName(names[0] ?? "");
  const handlePress = () => { if (slug) router.push(`/festival/${slug}`); };
  return (
    <Pressable
      style={[styles.todayCard, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}
      onPress={handlePress}
    >
      <View style={[styles.todayIcon, { backgroundColor: "#F59E0B" }]}>
        <Text style={styles.todayEmoji}>{emoji}</Text>
      </View>
      <View style={styles.cardContent}>
        {names.map((name, i) => (
          <Text key={i} style={[styles.festName, { color: "#92400E", fontSize: 16 }]}>{name}</Text>
        ))}
        <Text style={{ color: "#B45309", fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 }}>Today</Text>
      </View>
      {slug && <Text style={{ color: "#B45309", fontSize: 18 }}>›</Text>}
    </Pressable>
  );
}

function FestCard({ dateStr, names, daysLeft, colors }: { dateStr: string; names: string[]; daysLeft: number; colors: ReturnType<typeof useColors> }) {
  const emoji = getFestivalEmoji(names[0] ?? "");
  const isClose = daysLeft <= 7;
  const slug = getSlugForFestivalName(names[0] ?? "");
  const handlePress = () => { if (slug) router.push(`/festival/${slug}`); };
  return (
    <Pressable
      style={[styles.festCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
    >
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, color: "#C7D2FE", marginTop: 2, fontFamily: "Inter_400Regular" },
  tabRow: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  filterScroll: { borderBottomWidth: StyleSheet.hairlineWidth, maxHeight: 52 },
  filterContent: { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  filterChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 5 },
  filterLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
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
  daysNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
  daysSuffix: { fontSize: 10, fontFamily: "Inter_400Regular" },
  vratCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 12, gap: 10 },
  vratIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  vratEmoji: { fontSize: 22 },
  vratContent: { flex: 1, gap: 2 },
  vratNameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  vratName: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  specialBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  specialLabel: { fontSize: 9, fontFamily: "Inter_700Bold" },
  vratSig: { fontSize: 11, fontFamily: "Inter_400Regular" },
  vratDate: { fontSize: 11, fontFamily: "Inter_500Medium" },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 14, fontFamily: "Inter_400Regular" },
});
