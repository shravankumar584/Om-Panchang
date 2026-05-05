import React, { useState } from "react";
import {
  Linking, Platform, Pressable, ScrollView, StyleSheet, Text,
  TextInput, View, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";

type Tab = "disclaimer" | "privacy" | "contact";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "disclaimer", label: "Disclaimer", icon: "📋" },
  { key: "privacy",    label: "Privacy",    icon: "🔒" },
  { key: "contact",    label: "Contact",    icon: "✉️" },
];

export default function LegalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const [activeTab, setActiveTab] = useState<Tab>("disclaimer");

  const current = TABS.find(t => t.key === activeTab)!;

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
        <Text style={styles.headerTitle}>{current.icon} {current.label}</Text>
        <Text style={styles.headerSub}>Om Panchang · Legal & Contact</Text>
      </LinearGradient>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {TABS.map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tabBtn, activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabLabel, { color: activeTab === tab.key ? colors.primary : colors.mutedForeground }]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        key={activeTab}
      >
        {activeTab === "disclaimer" && <DisclaimerContent colors={colors} />}
        {activeTab === "privacy"    && <PrivacyContent colors={colors} />}
        {activeTab === "contact"    && <ContactContent colors={colors} />}
      </ScrollView>
    </View>
  );
}

// ─── Disclaimer ──────────────────────────────────────────────────────────────

function DisclaimerContent({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <>
      <Lede text="Last updated: April 2026" colors={colors} />

      <LegalSection title="General Information Only" colors={colors}>
        Om Panchang provides Hindu calendar, Panchang, Vedic astrology, and Jyotish information
        for <B>informational and educational purposes only</B>. All content — tithi, nakshatra,
        planetary positions, kundali charts, muhurta timings, and festival dates — is generated
        using standard astronomical algorithms and classical Jyotish formulas.{"\n\n"}
        The information does <B>not</B> constitute professional astrological, religious, medical,
        financial, or legal advice. Always consult a qualified Jyotishi or relevant professional
        for important life decisions.
      </LegalSection>

      <LegalSection title="Accuracy of Calculations" colors={colors}>
        While we strive for accuracy, astronomical calculations involve approximations.
        Sunrise/sunset times, tithi boundaries, nakshatra transitions, and planetary positions
        may vary slightly from those published by regional Panchang authorities or local
        temples. For official religious purposes, please refer to your local Pandit or temple
        calendar.{"\n\n"}
        Muhurta recommendations are algorithmic suggestions based on classical texts. Individual
        circumstances, family tradition, and professional astrological guidance should always
        take precedence.
      </LegalSection>

      <LegalSection title="Baby Name Suggestions" colors={colors}>
        Baby name suggestions are based on traditional Nakshatra syllable guidelines. These are
        general recommendations only. Naming decisions should involve family elders, priests,
        or a qualified astrologer.
      </LegalSection>

      <LegalSection title="No Warranties" colors={colors}>
        Om Panchang is provided "as is" without any warranties, express or implied. We make
        no guarantees regarding the completeness, reliability, or accuracy of the information.
        Your use of this app is at your own risk.
      </LegalSection>

      <LegalSection title="Changes to This Disclaimer" colors={colors}>
        We reserve the right to update this disclaimer at any time. Continued use of the app
        after changes constitutes acceptance of the revised disclaimer.
      </LegalSection>
    </>
  );
}

// ─── Privacy ─────────────────────────────────────────────────────────────────

function PrivacyContent({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <>
      <Lede text="Last updated: April 2026" colors={colors} />

      <LegalSection title="Information We Collect" colors={colors}>
        Om Panchang does <B>not</B> collect, store, or sell personal information. We do not
        require account registration or login to use any feature.{"\n\n"}
        <B>Locally stored preferences:</B> Your selected city and appearance preferences are
        saved on-device only. This data never leaves your device.
      </LegalSection>

      <LegalSection title="Birth Data (Kundali & Baby Names)" colors={colors}>
        Any birth date, time, or location you enter into our Kundali or Baby Names features
        is processed <B>entirely on your device</B>. This data is never transmitted to our
        servers or stored anywhere.
      </LegalSection>

      <LegalSection title="Analytics" colors={colors}>
        We may use privacy-respecting analytics to understand aggregate usage patterns.
        This data is anonymized and does not identify individual users.
      </LegalSection>

      <LegalSection title="Third-Party Services" colors={colors}>
        <B>Google Calendar:</B> If you add a festival to Google Calendar, we pass only the
        event name and date as URL parameters. Google's privacy policy governs what happens
        on their platform.
      </LegalSection>

      <LegalSection title="Children's Privacy" colors={colors}>
        Our app is not directed at children under 13. We do not knowingly collect information
        from children.
      </LegalSection>

      <LegalSection title="Changes to This Policy" colors={colors}>
        We may update this Privacy Policy from time to time. Changes are effective immediately
        upon posting to the app.
      </LegalSection>
    </>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

const SUBJECTS = [
  "General Inquiry",
  "Calculation Error / Bug Report",
  "Feature Request",
  "Festival / Event Missing",
  "City / Location Request",
  "Business / Partnership",
  "Other",
];

function ContactContent({ colors }: { colors: ReturnType<typeof useColors> }) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill in your name, email, and message.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    const subject = encodeURIComponent(SUBJECTS[subjectIdx] ?? "General Inquiry");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    Linking.openURL(`mailto:ompanchang.org@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <>
      <View style={[styles.contactIntro, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Text style={[styles.contactIntroText, { color: colors.mutedForeground }]}>
          Have a question, found a date error, or want to suggest a feature? We read every
          message and typically respond within 2–3 business days.
        </Text>
        <Pressable
          style={styles.directEmail}
          onPress={() => Linking.openURL("mailto:ompanchang.org@gmail.com")}
        >
          <Feather name="mail" size={14} color={colors.primary} />
          <Text style={[styles.directEmailText, { color: colors.primary }]}>
            ompanchang.org@gmail.com
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Field label="Your Name *" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
            placeholder="Ramesh Sharma"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field label="Email Address *" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
            placeholder="you@example.com"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>

        <Field label="Subject" colors={colors}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
            <View style={styles.subjectRow}>
              {SUBJECTS.map((s, i) => (
                <Pressable
                  key={s}
                  style={[
                    styles.subjectChip,
                    { borderColor: colors.border, backgroundColor: colors.muted },
                    subjectIdx === i && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setSubjectIdx(i)}
                >
                  <Text style={[
                    styles.subjectChipText,
                    { color: colors.mutedForeground },
                    subjectIdx === i && { color: "#FFFFFF" },
                  ]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Field>

        <Field label="Message *" colors={colors}>
          <TextInput
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
            placeholder="Tell us how we can help…"
            placeholderTextColor={colors.mutedForeground}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </Field>

        <Pressable
          style={[styles.sendBtn, { backgroundColor: colors.primary }]}
          onPress={handleSend}
        >
          <Feather name="send" size={16} color="#FFFFFF" />
          <Text style={styles.sendBtnText}>Open Email App to Send</Text>
        </Pressable>
      </View>
    </>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Lede({ text, colors }: { text: string; colors: ReturnType<typeof useColors> }) {
  return <Text style={[styles.lede, { color: colors.mutedForeground }]}>{text}</Text>;
}

function B({ children }: { children: React.ReactNode }) {
  return <Text style={styles.boldInline}>{children}</Text>;
}

function LegalSection({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.legalSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.legalTitle, { color: colors.primary }]}>{title}</Text>
      <Text style={[styles.legalBody, { color: colors.mutedForeground }]}>{children}</Text>
    </View>
  );
}

function Field({ label, children, colors }: { label: string; children: React.ReactNode; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.primary }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  backLabel: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_500Medium" },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  headerSub: { fontSize: 13, color: "#C7D2FE", marginTop: 2, fontFamily: "Inter_400Regular" },
  tabRow: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  lede: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right" },
  legalSection: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  legalTitle: { fontSize: 14, fontFamily: "Inter_700Bold", borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 6 },
  legalBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  boldInline: { fontFamily: "Inter_700Bold" },
  contactIntro: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  contactIntroText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  directEmail: { flexDirection: "row", alignItems: "center", gap: 6 },
  directEmailText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 14 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular" },
  textarea: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 110 },
  subjectScroll: { marginHorizontal: -2 },
  subjectRow: { flexDirection: "row", gap: 8, paddingHorizontal: 2, paddingBottom: 2 },
  subjectChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  subjectChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sendBtn: { borderRadius: 12, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  sendBtnText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
});
