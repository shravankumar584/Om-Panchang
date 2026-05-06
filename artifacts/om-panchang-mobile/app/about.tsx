import React from "react";
import {
  Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";

const FEATURES = [
  { icon: "📅", title: "Daily Panchang", desc: "Tithi, Nakshatra, Yoga, Karana & Vara for any date and city" },
  { icon: "🌙", title: "Vrat Calendar", desc: "All Ekadashi, Amavasya, Purnima, Pradosh & Sankashti dates" },
  { icon: "⏰", title: "Muhurta Timings", desc: "Abhijit Muhurta, Rahu Kalam, Brahma Muhurta daily" },
  { icon: "🌀", title: "Choghadiya", desc: "Day and night auspicious time slots with live current slot" },
  { icon: "🔮", title: "Kundali Calculator", desc: "Free Vedic birth chart using Lahiri Ayanamsa" },
  { icon: "💑", title: "Kundali Milan", desc: "Hindu marriage compatibility matching (Gun Milan)" },
  { icon: "🪐", title: "Planetary Positions", desc: "Live Navagraha positions in the sidereal zodiac" },
  { icon: "👶", title: "Baby Names", desc: "Auspicious Hindu baby names by Janma Nakshatra" },
  { icon: "🎉", title: "Festival Calendar", desc: "All major Hindu festivals with dates and significance" },
  { icon: "♈", title: "Horoscope", desc: "All 12 Vedic Rashis with traits and planetary rulers" },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

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
        <View style={styles.heroRow}>
          <Text style={styles.heroOm}>🕉️</Text>
          <View>
            <Text style={styles.heroTitle}>Om Panchang</Text>
            <Text style={styles.heroSub}>Hindu Calendar & Vedic Almanac</Text>
          </View>
        </View>
        <Text style={styles.heroCopy}>
          Bringing the ancient wisdom of Vedic timekeeping to the modern Hindu community worldwide.
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mission */}
        <Section title="🌟 Our Mission" colors={colors}>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Om Panchang was created with a single purpose — to make the profound depth of the Hindu
            Vedic calendar accessible to everyone, especially the millions of Hindu families living
            in the United States and across the global diaspora.
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            Whether you're looking for today's Tithi before starting something important, checking
            the next Ekadashi fasting date, finding an auspicious Muhurta, or generating a Kundali
            birth chart — Om Panchang is your single trusted destination for all things Vedic.
          </Text>
        </Section>

        {/* What We Offer */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>📿 What We Offer</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map(f => (
              <View key={f.title} style={[styles.featureItem, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>{f.title}</Text>
                  <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Methodology */}
        <Section title="🔭 Accuracy & Methodology" colors={colors}>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            All panchang calculations use the <Text style={styles.bold}>Drik (observed) method</Text> — the
            same modern standard used by leading panchang authorities. We use precise astronomical
            algorithms to compute sunrise, sunset, and planetary longitudes for your selected city.
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            Vedic calculations use the <Text style={styles.bold}>Lahiri Ayanamsa</Text> to convert
            tropical positions to the sidereal zodiac, consistent with the Government of India's
            official panchang standard.
          </Text>
          <View style={[styles.noteBanner, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}>
            <Text style={[styles.noteText, { color: "#92400E" }]}>
              ⚠️ Timings may vary slightly by location. For important ceremonies, always verify with
              your local Pandit or temple calendar.
            </Text>
          </View>
        </Section>

        {/* Who We Are */}
        <Section title="🙏 Who We Are" colors={colors}>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Om Panchang is an independent project built by and for the global Hindu community. We
            are passionate about preserving and sharing the richness of Vedic knowledge — making
            it freely available in a clean, accurate, and modern format for families who may be
            far from home but never far from their traditions.
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            The app is free to use and always will be. We continuously improve it based on
            community feedback.
          </Text>
        </Section>

        {/* Contact */}
        <View style={[styles.card, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <Text style={styles.contactTitle}>✉️ Contact Us</Text>
          <Text style={styles.contactBody}>
            Have a question, found a date error, or want to suggest a feature? We love hearing
            from our community and read every message.
          </Text>
          <Pressable
            style={styles.emailBtn}
            onPress={() => Linking.openURL("mailto:ompanchang.org@gmail.com")}
          >
            <Feather name="mail" size={16} color={colors.primary} />
            <Text style={[styles.emailBtnText, { color: colors.primary }]}>
              ompanchang.org@gmail.com
            </Text>
          </Pressable>
        </View>

        {/* Footer links */}
        <View style={styles.footerRow}>
          <Pressable onPress={() => router.push("/blog")}>
            <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Blog</Text>
          </Pressable>
          <Text style={[styles.footerDot, { color: colors.mutedForeground }]}>·</Text>
          <Pressable onPress={() => router.push("/legal")}>
            <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Disclaimer</Text>
          </Pressable>
          <Text style={[styles.footerDot, { color: colors.mutedForeground }]}>·</Text>
          <Pressable onPress={() => router.push("/legal")}>
            <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Privacy Policy</Text>
          </Pressable>
          <Text style={[styles.footerDot, { color: colors.mutedForeground }]}>·</Text>
          <Pressable onPress={() => router.push("/legal")}>
            <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>Contact</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 },
  backLabel: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_500Medium" },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  heroOm: { fontSize: 40 },
  heroTitle: { color: "#FFFFFF", fontSize: 24, fontFamily: "Inter_700Bold" },
  heroSub: { color: "#C7D2FE", fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  heroCopy: { color: "#E0E7FF", fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 14 },
  card: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  body: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  bold: { fontFamily: "Inter_700Bold" },
  featuresGrid: { gap: 8 },
  featureItem: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderRadius: 12, borderWidth: 1, padding: 10 },
  featureIcon: { fontSize: 22, width: 28, textAlign: "center" },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  featureDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2, lineHeight: 16 },
  noteBanner: { borderRadius: 10, borderWidth: 1, padding: 10, marginTop: 8 },
  noteText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  contactTitle: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  contactBody: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  emailBtn: { backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" },
  emailBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, paddingTop: 4 },
  footerLink: { fontSize: 12, fontFamily: "Inter_500Medium" },
  footerDot: { fontSize: 12 },
});
