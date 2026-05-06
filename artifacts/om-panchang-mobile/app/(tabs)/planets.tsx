import React, { useState } from "react";
import {
  Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BLOG_ARTICLES, BLOG_CATEGORIES, type BlogArticle } from "@/lib/blogData";
import { useColors } from "@/hooks/useColors";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const GRADIENT_COLORS: Record<string, [string, string]> = {
  "from-blue-700 via-indigo-700 to-purple-700": ["#1D4ED8", "#7C3AED"],
  "from-orange-700 via-red-700 to-pink-700":    ["#C2410C", "#BE185D"],
  "from-emerald-700 via-teal-700 to-cyan-700":  ["#047857", "#0E7490"],
  "from-purple-700 via-violet-700 to-indigo-700": ["#7E22CE", "#4338CA"],
  "from-rose-700 via-pink-700 to-fuchsia-700":  ["#BE123C", "#A21CAF"],
  "from-amber-700 via-orange-700 to-red-700":   ["#B45309", "#C2410C"],
  "from-indigo-800 via-blue-700 to-sky-600":    ["#3730A3", "#0284C7"],
  "from-teal-700 via-emerald-700 to-green-700": ["#0F766E", "#15803D"],
  "from-violet-800 via-purple-700 to-fuchsia-600": ["#5B21B6", "#A21CAF"],
  "from-sky-700 via-blue-700 to-indigo-700":    ["#0369A1", "#4338CA"],
  "from-green-700 via-emerald-700 to-teal-700": ["#15803D", "#0F766E"],
  "from-red-700 via-rose-700 to-pink-700":      ["#B91C1C", "#BE185D"],
};

function getGradient(tailwind: string): [string, string] {
  return GRADIENT_COLORS[tailwind] ?? ["#4338CA", "#7C3AED"];
}

export default function ArticlesTabScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter(a => a.category === activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.heroRow}>
          <Text style={styles.heroEmoji}>📖</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Hindu Knowledge Hub</Text>
            <Text style={styles.heroSub}>Deities · Panchang · Mantras · Culture</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { borderBottomColor: colors.border, backgroundColor: colors.card }]}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable
          style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.muted },
            activeCategory === "all" && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setActiveCategory("all")}
        >
          <Text style={[styles.filterLabel, { color: colors.mutedForeground },
            activeCategory === "all" && { color: "#FFFFFF" }]}>All</Text>
        </Pressable>
        {BLOG_CATEGORIES.map(cat => (
          <Pressable
            key={cat.name}
            style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.muted },
              activeCategory === cat.name && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => setActiveCategory(cat.name)}
          >
            <Text style={styles.filterEmoji}>{cat.emoji}</Text>
            <Text style={[styles.filterLabel, { color: colors.mutedForeground },
              activeCategory === cat.name && { color: "#FFFFFF" }]}>{cat.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeCategory === "all" ? (
          BLOG_CATEGORIES.map(cat => {
            const articles = BLOG_ARTICLES.filter(a => a.category === cat.name);
            if (articles.length === 0) return null;
            return (
              <View key={cat.name} style={styles.categorySection}>
                <View style={styles.catHeaderRow}>
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <View>
                    <Text style={[styles.catName, { color: colors.foreground }]}>{cat.name}</Text>
                    <Text style={[styles.catDesc, { color: colors.mutedForeground }]}>{cat.description}</Text>
                  </View>
                </View>
                {articles.map(article => (
                  <ArticleCard key={article.slug} article={article} colors={colors} />
                ))}
              </View>
            );
          })
        ) : (
          filtered.map(article => (
            <ArticleCard key={article.slug} article={article} colors={colors} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ArticleCard({ article, colors }: { article: BlogArticle; colors: ReturnType<typeof useColors> }) {
  const [start, end] = getGradient(article.gradient);
  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/blog/${article.slug}`)}
    >
      <LinearGradient colors={[start, end]} style={styles.cardHero}>
        <Text style={styles.cardEmoji}>{article.emoji}</Text>
        <View style={styles.cardHeroText}>
          <Text style={styles.cardCategory}>{article.category}</Text>
          <Text style={styles.cardTitle}>{article.cardTitle}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={[styles.cardExcerpt, { color: colors.mutedForeground }]} numberOfLines={3}>
          {article.excerpt}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>{formatDate(article.publishDate)}</Text>
          <Text style={[styles.cardRead, { color: colors.primary }]}>{article.readTime} min read →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  heroEmoji: { fontSize: 36 },
  heroTitle: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  heroSub: { color: "#C7D2FE", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  filterScroll: { borderBottomWidth: StyleSheet.hairlineWidth, maxHeight: 52 },
  filterContent: { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  filterChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 4 },
  filterEmoji: { fontSize: 12 },
  filterLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  content: { padding: 14, gap: 10 },
  categorySection: { gap: 8 },
  catHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6, marginBottom: 2 },
  catEmoji: { fontSize: 22 },
  catName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  catDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHero: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  cardEmoji: { fontSize: 36 },
  cardHeroText: { flex: 1 },
  cardCategory: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  cardTitle: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 2, lineHeight: 20 },
  cardBody: { padding: 12, gap: 8 },
  cardExcerpt: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  cardRead: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
