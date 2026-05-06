import React, { useState } from "react";
import {
  Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { getArticleBySlug, getRelatedArticles, type BlogArticle } from "@/lib/blogData";
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

export default function BlogDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const article = getArticleBySlug(slug ?? "");

  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>📖</Text>
        <Text style={[styles.notFoundTitle, { color: colors.foreground }]}>Article not found</Text>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Browse all articles</Text>
        </Pressable>
      </View>
    );
  }

  const related = getRelatedArticles(article);
  const [start, end] = getGradient(article.gradient);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient colors={[start, end]} style={[styles.hero, { paddingTop: topPad + 8 }]}>
          <Pressable style={styles.backRow} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
            <Text style={styles.backLabel}>Knowledge Hub</Text>
          </Pressable>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>{article.emoji}</Text>
            <View style={styles.heroText}>
              <Text style={styles.heroCategory}>{article.category}</Text>
              <Text style={styles.heroTitle}>{article.title}</Text>
              <Text style={styles.heroMeta}>
                {formatDate(article.publishDate)} · {article.readTime} min read
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Intro */}
          <View style={[styles.introBlock, { borderLeftColor: colors.primary, backgroundColor: colors.card }]}>
            <Text style={[styles.introText, { color: colors.foreground }]}>{article.intro}</Text>
          </View>

          {/* Sections */}
          {article.sections.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text style={[styles.sectionHeading, { color: colors.primary }]}>{section.heading}</Text>
              {section.paragraphs.map((para, j) => (
                <Text key={j} style={[styles.paragraph, { color: colors.foreground }]}>{para}</Text>
              ))}
            </View>
          ))}

          {/* FAQs */}
          {article.faqs.length > 0 && (
            <View style={styles.faqSection}>
              <Text style={[styles.sectionHeading, { color: colors.primary }]}>Frequently Asked Questions</Text>
              {article.faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} colors={colors} />
              ))}
            </View>
          )}

          {/* Related articles */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.sectionHeading, { color: colors.primary }]}>Related Articles</Text>
              {related.map(rel => (
                <RelatedCard key={rel.slug} article={rel} colors={colors} />
              ))}
            </View>
          )}

          {/* Back button */}
          <Pressable
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={14} color="#FFFFFF" />
            <Text style={styles.backBtnText}>All Articles</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function FaqItem({ question, answer, colors }: {
  question: string;
  answer: string;
  colors: ReturnType<typeof useColors>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => setOpen(o => !o)}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.foreground }]}>{question}</Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
      </View>
      {open && (
        <Text style={[styles.faqAnswer, { color: colors.mutedForeground }]}>{answer}</Text>
      )}
    </Pressable>
  );
}

function RelatedCard({ article, colors }: { article: BlogArticle; colors: ReturnType<typeof useColors> }) {
  const [start, end] = getGradient(article.gradient);
  return (
    <Pressable
      style={[styles.relatedCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.replace(`/blog/${article.slug}`)}
    >
      <LinearGradient colors={[start, end]} style={styles.relatedGradient}>
        <Text style={styles.relatedEmoji}>{article.emoji}</Text>
      </LinearGradient>
      <View style={styles.relatedText}>
        <Text style={[styles.relatedTitle, { color: colors.foreground }]} numberOfLines={2}>
          {article.cardTitle}
        </Text>
        <Text style={[styles.relatedExcerpt, { color: colors.mutedForeground }]} numberOfLines={2}>
          {article.excerpt}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  hero: { paddingHorizontal: 16, paddingBottom: 20 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backLabel: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_500Medium" },
  heroContent: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  heroEmoji: { fontSize: 52, marginTop: 4 },
  heroText: { flex: 1 },
  heroCategory: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  heroTitle: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold", marginTop: 4, lineHeight: 28 },
  heroMeta: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 6 },
  body: { padding: 16, gap: 20 },
  introBlock: { borderLeftWidth: 4, borderRadius: 4, padding: 14 },
  introText: { fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 23, fontStyle: "italic" },
  section: { gap: 10 },
  sectionHeading: { fontSize: 17, fontFamily: "Inter_700Bold", lineHeight: 24 },
  paragraph: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 23 },
  faqSection: { gap: 10 },
  faqItem: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  faqHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  faqQuestion: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1, lineHeight: 20 },
  faqAnswer: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  relatedSection: { gap: 10 },
  relatedCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, overflow: "hidden", gap: 12 },
  relatedGradient: { width: 60, height: 60, justifyContent: "center", alignItems: "center" },
  relatedEmoji: { fontSize: 26 },
  relatedText: { flex: 1, paddingVertical: 10 },
  relatedTitle: { fontSize: 13, fontFamily: "Inter_700Bold", lineHeight: 18 },
  relatedExcerpt: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 16 },
  notFoundTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 16 },
  backBtn: { borderRadius: 14, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  backBtnText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
});
