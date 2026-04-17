import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CITIES } from "@/lib/panchangData";
import { localToUtcMs } from "@/lib/tzMath";
import { computeKundali } from "@/lib/jyotishData";
import { computeMilan, MilanResult, RASHI_NAMES_SA, NAKSHATRA_NAMES_SA } from "@/lib/kundaliMilan";

interface PersonInput {
  name: string;
  date: string;     // YYYY-MM-DD
  time: string;     // HH:MM 24h
  cityIdx: number;
}

function parseInputs(date: string, time: string) {
  const dm = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const tm = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!dm || !tm) return null;
  const y = +dm[1], m = +dm[2], d = +dm[3], h = +tm[1], mi = +tm[2];
  if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return { y, m, d, h, mi };
}

function computePersonRashiNak(p: PersonInput): { rashi: number; nakshatra: number } | null {
  const parsed = parseInputs(p.date, p.time);
  if (!parsed) return null;
  const city = CITIES[p.cityIdx];
  const utcMs = localToUtcMs(city.timezone, parsed.y, parsed.m, parsed.d, parsed.h, parsed.mi);
  const k = computeKundali(new Date(utcMs), city.lat, city.lon);
  return { rashi: k.moonSignIndex, nakshatra: k.moonNakshatraIndex };
}

// ─── PersonForm (compact) ─────────────────────────────────────────────────────
function PersonForm({
  label, color, emoji, value, onChange,
}: {
  label: string; color: string; emoji: string;
  value: PersonInput; onChange: (v: PersonInput) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [filter, setFilter] = useState("");
  const city = CITIES[value.cityIdx];

  const filtered = useMemo(() =>
    CITIES.filter(c =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.country.toLowerCase().includes(filter.toLowerCase()),
    ).slice(0, 30),
  [filter]);

  return (
    <View style={[styles.personCard, { backgroundColor: color }]}>
      <Text style={styles.personTitle}>{emoji} {label}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={value.name}
        onChangeText={t => onChange({ ...value, name: t })}
        placeholder="e.g. Priya"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={value.date}
            onChangeText={t => onChange({ ...value, date: t })}
            placeholder="1996-06-15"
            placeholderTextColor="rgba(255,255,255,0.5)"
            autoCapitalize="none" autoCorrect={false}
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Time (24h)</Text>
          <TextInput
            style={styles.input}
            value={value.time}
            onChangeText={t => onChange({ ...value, time: t })}
            placeholder="06:30"
            placeholderTextColor="rgba(255,255,255,0.5)"
            autoCapitalize="none" autoCorrect={false}
            keyboardType="numbers-and-punctuation"
          />
        </View>
      </View>

      <Text style={styles.label}>Place of Birth</Text>
      <Pressable style={styles.input} onPress={() => setShowPicker(s => !s)}>
        <Text style={styles.inputText}>📍 {city.name}, {city.country}</Text>
      </Pressable>

      {showPicker && (
        <View style={styles.pickerBox}>
          <TextInput
            style={[styles.pickerInput]}
            value={filter} onChangeText={setFilter}
            placeholder="Search city…" placeholderTextColor="#94A3B8"
          />
          <ScrollView style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {filtered.map((c) => {
              const idx = CITIES.indexOf(c);
              return (
                <Pressable key={`${c.name}-${idx}`} style={styles.pickerRow} onPress={() => { onChange({ ...value, cityIdx: idx }); setShowPicker(false); setFilter(""); }}>
                  <Text style={styles.pickerName}>{c.name}</Text>
                  <Text style={styles.pickerCountry}>{c.country}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─── Koota Row ─────────────────────────────────────────────────────────────────
function KootaRow({
  rank, name, score, max, detail, dosha,
}: {
  rank: number; name: string; score: number; max: number; detail: string; dosha: boolean;
}) {
  const pct = (score / max) * 100;
  const barColor = pct >= 75 ? "#10B981" : pct >= 50 ? "#F59E0B" : pct > 0 ? "#F97316" : "#F43F5E";
  return (
    <View style={[styles.kootaRow, dosha && styles.kootaDosha]}>
      <View style={styles.kootaTopRow}>
        <Text style={styles.kootaRank}>{rank}.</Text>
        <Text style={styles.kootaName}>{name}</Text>
        <Text style={styles.kootaScore}>{score}/{max}</Text>
      </View>
      <View style={styles.kootaBar}>
        <View style={[styles.kootaBarFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.kootaDetail}>{detail}</Text>
      {dosha && <Text style={styles.doshaWarn}>⚠️ Dosha — special remedies recommended</Text>}
    </View>
  );
}

export default function KundaliMilanScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const defYear = today.getFullYear() - 28;
  const defaultIdx = Math.max(0, CITIES.findIndex(c => c.country === "India"));

  const [boy, setBoy] = useState<PersonInput>({
    name: "Arjun", date: `${defYear}-08-12`, time: "10:30", cityIdx: defaultIdx >= 0 ? defaultIdx : 0,
  });
  const [girl, setGirl] = useState<PersonInput>({
    name: "Priya", date: `${defYear + 2}-04-22`, time: "06:15", cityIdx: defaultIdx >= 0 ? defaultIdx : 0,
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState<MilanResult | null>(null);
  const [boyRash, setBoyRash] = useState<{ rashi: number; nakshatra: number } | null>(null);
  const [girlRash, setGirlRash] = useState<{ rashi: number; nakshatra: number } | null>(null);

  function calculate() {
    setError("");
    const b = computePersonRashiNak(boy);
    const g = computePersonRashiNak(girl);
    if (!b || !g) { setError("Use date YYYY-MM-DD and time HH:MM (24h) for both."); return; }
    setBoyRash(b); setGirlRash(g);
    setResult(computeMilan(b.rashi, b.nakshatra, g.rashi, g.nakshatra));
  }

  const recColor = !result ? "" :
    result.recommendation === "Excellent" ? "#10B981" :
    result.recommendation === "Good"      ? "#22C55E" :
    result.recommendation === "Acceptable"? "#F59E0B" :
    result.recommendation === "Below average" ? "#F97316" : "#F43F5E";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ title: "Kundali Milan" }} />
      <LinearGradient colors={["#BE123C", "#7C3AED"]} style={[styles.header, { paddingTop: 16 }]}>
        <Text style={styles.headerEyebrow}>ASHTAKOOTA MATCHING</Text>
        <Text style={styles.headerTitle}>💞 Kundali Milan</Text>
        <Text style={styles.headerSub}>36-Guna compatibility · Vedic horoscope match</Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#F8FAFC" }}
        contentContainerStyle={{ padding: 14, paddingBottom: insets.bottom + 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <PersonForm
          label="Boy / Groom" emoji="🤵" color="#1E40AF"
          value={boy} onChange={setBoy}
        />
        <View style={{ height: 12 }} />
        <PersonForm
          label="Girl / Bride" emoji="👰" color="#9D174D"
          value={girl} onChange={setGirl}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.calcBtn} onPress={calculate}>
          <Text style={styles.calcBtnText}>💖 Match Kundalis</Text>
        </Pressable>

        {result && boyRash && girlRash && (
          <>
            {/* Score header */}
            <View style={[styles.scoreCard, { borderColor: recColor }]}>
              <Text style={styles.scoreEyebrow}>TOTAL COMPATIBILITY</Text>
              <Text style={[styles.scoreNumber, { color: recColor }]}>
                {result.total} <Text style={styles.scoreOutOf}>/ 36</Text>
              </Text>
              <View style={[styles.recPill, { backgroundColor: recColor }]}>
                <Text style={styles.recPillText}>{result.recommendation}</Text>
              </View>
              <Text style={styles.scoreSub}>
                {boy.name || "Boy"} — {RASHI_NAMES_SA[boyRash.rashi]} · {NAKSHATRA_NAMES_SA[boyRash.nakshatra]}{"\n"}
                {girl.name || "Girl"} — {RASHI_NAMES_SA[girlRash.rashi]} · {NAKSHATRA_NAMES_SA[girlRash.nakshatra]}
              </Text>
            </View>

            <Text style={styles.kootaSection}>EIGHT KOOTAS</Text>

            <KootaRow rank={1} name="Varna" score={result.varna.score} max={1}
              detail={`Boy: ${result.varna.boyVarna} · Girl: ${result.varna.girlVarna}`}
              dosha={result.varna.dosha}
            />
            <KootaRow rank={2} name="Vashya" score={result.vashya.score} max={2}
              detail={`Mutual control / dominance`}
              dosha={result.vashya.score === 0}
            />
            <KootaRow rank={3} name="Tara" score={result.tara.score} max={3}
              detail={`Boy's tara: ${result.tara.boyTara} · Girl's tara: ${result.tara.girlTara}`}
              dosha={result.tara.dosha}
            />
            <KootaRow rank={4} name="Yoni" score={result.yoni.score} max={4}
              detail={`Boy: ${result.yoni.boyYoni} · Girl: ${result.yoni.girlYoni}`}
              dosha={result.yoni.dosha}
            />
            <KootaRow rank={5} name="Graha Maitri" score={result.grahaMaitri.score} max={5}
              detail={`${result.grahaMaitri.boyLord} & ${result.grahaMaitri.girlLord} — ${result.grahaMaitri.relation}`}
              dosha={result.grahaMaitri.score === 0}
            />
            <KootaRow rank={6} name="Gana" score={result.gana.score} max={6}
              detail={`Boy: ${result.gana.boyGana} · Girl: ${result.gana.girlGana}`}
              dosha={result.gana.dosha}
            />
            <KootaRow rank={7} name="Bhakoot" score={result.bhakoot.score} max={7}
              detail={result.bhakoot.relation}
              dosha={result.bhakoot.dosha}
            />
            <KootaRow rank={8} name="Nadi" score={result.nadi.score} max={8}
              detail={`Boy: ${result.nadi.boyNadi} · Girl: ${result.nadi.girlNadi}`}
              dosha={result.nadi.dosha}
            />

            <View style={styles.disclaim}>
              <Text style={styles.disclaimText}>
                ℹ️ Ashtakoota uses Moon-sign (rashi) and birth nakshatra. A holistic match also considers
                Mangal dosha, Lagna compatibility, and Dasha analysis. Consult a Jyotishi for life decisions.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerEyebrow: { color: "#FCA5A5", fontSize: 11, letterSpacing: 1.5, fontFamily: "Inter_600SemiBold" },
  headerTitle: { color: "#fff", fontSize: 26, fontFamily: "Inter_700Bold", marginTop: 2 },
  headerSub: { color: "#FBCFE8", fontSize: 12, marginTop: 4, fontFamily: "Inter_400Regular" },

  personCard: { padding: 14, borderRadius: 16 },
  personTitle: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 8 },
  label: { color: "rgba(255,255,255,0.85)", fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.6, textTransform: "uppercase", marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)", borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium",
  },
  inputText: { color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium" },
  row2: { flexDirection: "row", gap: 8 },

  pickerBox: { marginTop: 8, padding: 8, backgroundColor: "#fff", borderRadius: 10 },
  pickerInput: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: "#1E293B", fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6 },
  pickerRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7, paddingHorizontal: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E2E8F0" },
  pickerName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#1E293B" },
  pickerCountry: { fontSize: 11, color: "#64748B", fontFamily: "Inter_400Regular" },

  errorText: { color: "#DC2626", fontSize: 12, marginTop: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  calcBtn: { marginTop: 16, backgroundColor: "#9333EA", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  calcBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },

  scoreCard: { marginTop: 18, padding: 18, backgroundColor: "#fff", borderRadius: 18, borderWidth: 2, alignItems: "center" },
  scoreEyebrow: { color: "#64748B", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1.2 },
  scoreNumber: { fontSize: 56, fontFamily: "Inter_700Bold", marginTop: 4 },
  scoreOutOf: { fontSize: 22, color: "#94A3B8", fontFamily: "Inter_500Medium" },
  recPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginTop: 6 },
  recPillText: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  scoreSub: { textAlign: "center", color: "#475569", fontSize: 12, marginTop: 12, fontFamily: "Inter_500Medium", lineHeight: 18 },

  kootaSection: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#9333EA", letterSpacing: 1.5, marginTop: 22, marginBottom: 8, paddingHorizontal: 4 },

  kootaRow: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#E2E8F0" },
  kootaDosha: { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
  kootaTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  kootaRank: { fontSize: 12, color: "#94A3B8", fontFamily: "Inter_700Bold" },
  kootaName: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1E293B", flex: 1 },
  kootaScore: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#4338CA" },
  kootaBar: { backgroundColor: "#E2E8F0", height: 5, borderRadius: 3, marginTop: 6, overflow: "hidden" },
  kootaBarFill: { height: 5, borderRadius: 3 },
  kootaDetail: { fontSize: 11, color: "#475569", marginTop: 6, fontFamily: "Inter_400Regular", lineHeight: 16 },
  doshaWarn: { fontSize: 10, color: "#B91C1C", marginTop: 4, fontFamily: "Inter_600SemiBold" },

  disclaim: { backgroundColor: "#FEF3C7", borderColor: "#FCD34D", borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 16 },
  disclaimText: { fontSize: 11, color: "#92400E", lineHeight: 16, fontFamily: "Inter_400Regular" },
});
