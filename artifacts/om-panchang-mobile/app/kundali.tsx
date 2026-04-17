import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Rect, Line, Text as SvgText, G } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCity } from "@/contexts/CityContext";
import { CITIES } from "@/lib/panchangData";
import { localToUtcMs } from "@/lib/tzMath";
import {
  computeKundali, formatDegree, formatDate, dashaProgress,
  KundaliData, PLANET_COLOR, LAGNA_INTERPRETATIONS,
} from "@/lib/jyotishData";

const SIGN_ABBR = ["Mes","Vri","Mit","Kar","Sim","Kan","Tul","Vri","Dha","Mak","Kum","Mee"];

const HOUSE_CELLS: { house: number; row: number; col: number }[] = [
  { house: 1, row: 0, col: 1 }, { house: 2, row: 0, col: 0 },
  { house: 3, row: 1, col: 0 }, { house: 4, row: 2, col: 0 },
  { house: 5, row: 3, col: 0 }, { house: 6, row: 3, col: 1 },
  { house: 7, row: 3, col: 2 }, { house: 8, row: 3, col: 3 },
  { house: 9, row: 2, col: 3 }, { house: 10, row: 1, col: 3 },
  { house: 11, row: 0, col: 3 }, { house: 12, row: 0, col: 2 },
];

function NorthIndianChart({ data }: { data: KundaliData }) {
  const CW = 78, CH = 78, W = CW * 4, H = CH * 4;
  const housePlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];
  for (const p of data.planets) {
    const h = Math.min(12, Math.max(1, p.house));
    housePlanets[h].push(`${p.symbol}${p.isRetrograde ? "ᴿ" : ""}`);
  }
  const signForHouse = (h: number) => (data.lagnaSignIndex + h - 1) % 12;

  return (
    <View style={{ alignItems: "center", marginVertical: 8 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Rect width={W} height={H} rx={8} fill="#F5F3FF" stroke="#6366F1" strokeWidth={1.5} />
        {[1,2,3].map(i => (
          <Line key={`v${i}`} x1={i*CW} y1={0} x2={i*CW} y2={H} stroke="#818CF8" strokeWidth={0.8} />
        ))}
        {[1,2,3].map(i => (
          <Line key={`h${i}`} x1={0} y1={i*CH} x2={W} y2={i*CH} stroke="#818CF8" strokeWidth={0.8} />
        ))}
        <Rect x={CW} y={CH} width={2*CW} height={2*CH} fill="#E0E7FF" stroke="#6366F1" strokeWidth={1} />
        <SvgText x={W/2} y={CH*2 - 8} textAnchor="middle" fontSize={10} fill="#4338CA" fontWeight="bold">ॐ</SvgText>
        <SvgText x={W/2} y={CH*2 + 6} textAnchor="middle" fontSize={9} fill="#4338CA" fontWeight="600">{data.lagnaSign}</SvgText>
        <SvgText x={W/2} y={CH*2 + 19} textAnchor="middle" fontSize={8} fill="#6366F1">Lagna</SvgText>

        {HOUSE_CELLS.map(({ house, row, col }) => {
          const x = col * CW, y = row * CH;
          const signIdx = signForHouse(house);
          const planetsHere = housePlanets[house] ?? [];
          const isLagna = house === 1;
          return (
            <G key={house}>
              {isLagna && <Rect x={x+0.5} y={y+0.5} width={CW-1} height={CH-1} fill="#EDE9FE" />}
              <SvgText x={x+6} y={y+13} fontSize={8} fill="#6366F1" fontWeight="bold" opacity={0.7}>{house}</SvgText>
              <SvgText x={x+CW-6} y={y+13} textAnchor="end" fontSize={8} fill="#9333EA" opacity={0.8}>{SIGN_ABBR[signIdx]}</SvgText>
              {planetsHere.map((sym, i) => (
                <SvgText
                  key={i}
                  x={x + CW/2}
                  y={y + CH/2 + (i - (planetsHere.length-1)/2) * 13 + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill={isLagna ? "#4338CA" : "#1E1B4B"}
                  fontWeight="bold"
                >
                  {sym}
                </SvgText>
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

function PlanetTable({ data }: { data: KundaliData }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        <Text style={[styles.tCell, styles.colPlanet, styles.tHead]}>Planet</Text>
        <Text style={[styles.tCell, styles.colSign,   styles.tHead]}>Sign</Text>
        <Text style={[styles.tCell, styles.colHouse,  styles.tHead]}>H</Text>
        <Text style={[styles.tCell, styles.colNak,    styles.tHead]}>Nakshatra</Text>
        <Text style={[styles.tCell, styles.colDeg,    styles.tHead, { textAlign: "right" }]}>Deg</Text>
      </View>
      {data.planets.map(p => (
        <View key={p.id} style={styles.tableRow}>
          <Text style={[styles.tCell, styles.colPlanet, { color: PLANET_COLOR[p.id], fontFamily: "Inter_700Bold" }]}>
            {p.symbol} {p.name}{p.isRetrograde ? " ᴿ" : ""}
          </Text>
          <Text style={[styles.tCell, styles.colSign]}>{p.sign}</Text>
          <Text style={[styles.tCell, styles.colHouse, { textAlign: "center", fontFamily: "Inter_700Bold", color: "#4338CA" }]}>{p.house}</Text>
          <Text style={[styles.tCell, styles.colNak]} numberOfLines={1}>{p.nakshatra} <Text style={{ color: "#818CF8" }}>P{p.nakshatraPada}</Text></Text>
          <Text style={[styles.tCell, styles.colDeg, { textAlign: "right" }]}>{formatDegree(p.degInSign)}</Text>
        </View>
      ))}
    </View>
  );
}

function DashaSection({ data }: { data: KundaliData }) {
  const now = new Date();
  const prog = dashaProgress(data.currentDasha);
  return (
    <View style={{ gap: 14 }}>
      <View style={styles.dashaCurrent}>
        <Text style={styles.dashaLabel}>CURRENT MAHADASHA</Text>
        <View style={styles.dashaCurrentRow}>
          <Text style={{ fontSize: 32 }}>{data.currentDasha.symbol}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.dashaTitle}>{data.currentDasha.lord} Dasha</Text>
            <Text style={styles.dashaDates}>{formatDate(data.currentDasha.start)} – {formatDate(data.currentDasha.end)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.dashaYears}>{data.currentDasha.years} yrs</Text>
            <Text style={styles.dashaPct}>{prog.toFixed(1)}% elapsed</Text>
          </View>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${prog}%` }]} />
        </View>
      </View>

      <View>
        <Text style={styles.subHead}>Antardashas (Sub-periods)</Text>
        <View style={styles.listCard}>
          {data.antar.map((a, i) => (
            <View key={i} style={[
              styles.antarRow,
              a.isCurrent && { backgroundColor: "#FEF3C7", borderLeftWidth: 3, borderLeftColor: "#F59E0B" },
            ]}>
              <Text style={{ fontSize: 16 }}>{a.symbol}</Text>
              <Text style={[styles.antarLord, a.isCurrent && { color: "#92400E" }]}>{a.lord}</Text>
              {a.isCurrent && <Text style={styles.antarBadge}>Now</Text>}
              <Text style={styles.antarDate}>{formatDate(a.start)} – {formatDate(a.end)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.subHead}>Dasha Timeline</Text>
        <View style={{ gap: 4 }}>
          {data.upcomingDashas.map((d, i) => {
            const isCurr = now >= d.start && now < d.end;
            const isPast = now >= d.end;
            return (
              <View key={i} style={[
                styles.timelineRow,
                isCurr && { backgroundColor: "#E0E7FF", borderColor: "#818CF8", borderWidth: 1 },
                isPast && { opacity: 0.4 },
              ]}>
                <Text style={{ fontSize: 14, width: 22 }}>{d.symbol}</Text>
                <Text style={styles.timelineLord}>{d.lord}</Text>
                <Text style={styles.timelineYrs}>{d.years}y</Text>
                <Text style={styles.timelineDate}>{formatDate(d.start)} – {formatDate(d.end)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function InfoTile({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <View style={styles.infoTile}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {sub && <Text style={styles.infoSub}>{sub}</Text>}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Date/Time validators ──────────────────────────────────────────────────────
function parseInputs(date: string, time: string): { y: number; m: number; d: number; h: number; mi: number } | null {
  const dm = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const tm = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!dm || !tm) return null;
  const y = +dm[1], m = +dm[2], d = +dm[3], h = +tm[1], mi = +tm[2];
  if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return { y, m, d, h, mi };
}

export default function KundaliScreen() {
  const insets = useSafeAreaInsets();
  const { selectedCity } = useCity();
  const today = new Date();
  const defYear = today.getFullYear() - 30;

  const [birthDate, setBirthDate] = useState(`${defYear}-06-15`);
  const [birthTime, setBirthTime] = useState("06:30");
  const [pickedCityIdx, setPickedCityIdx] = useState<number>(() =>
    Math.max(0, CITIES.findIndex(c => c.name === selectedCity.name)),
  );
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [kundali, setKundali] = useState<KundaliData | null>(null);

  const birthCity = CITIES[pickedCityIdx];

  function calculate() {
    setError("");
    const parsed = parseInputs(birthDate, birthTime);
    if (!parsed) { setError("Use YYYY-MM-DD for date and HH:MM (24h) for time."); return; }
    try {
      const { y, m, d, h, mi } = parsed;
      const utcMs = localToUtcMs(birthCity.timezone, y, m, d, h, mi);
      const result = computeKundali(new Date(utcMs), birthCity.lat, birthCity.lon);
      setKundali(result);
    } catch (e) {
      setError("Calculation failed. Check inputs.");
    }
  }

  const filteredCities = useMemo(() =>
    CITIES.filter(c =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.country.toLowerCase().includes(filter.toLowerCase()),
    ).slice(0, 30),
  [filter]);

  const interp = kundali ? LAGNA_INTERPRETATIONS[kundali.lagnaSign] : null;
  const moon = kundali?.planets.find(p => p.id === "moon");
  const sun  = kundali?.planets.find(p => p.id === "sun");

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ title: "Kundali" }} />
      <LinearGradient colors={["#4338CA", "#7C3AED"]} style={[styles.kHeader, { paddingTop: 16 }]}>
        <Text style={styles.kHeaderEyebrow}>VEDIC BIRTH CHART</Text>
        <Text style={styles.kHeaderTitle}>🪷 Kundali</Text>
        <Text style={styles.kHeaderSub}>D-1 Rashi · Vimshottari Dasha · Lagna reading</Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}>
        {/* Inputs card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Birth Details</Text>
          <Text style={styles.formLabel}>Date of Birth</Text>
          <TextInput
            style={styles.input} value={birthDate} onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8"
            autoCapitalize="none" autoCorrect={false} keyboardType="numbers-and-punctuation"
          />
          <Text style={styles.formLabel}>Time of Birth (24-hour)</Text>
          <TextInput
            style={styles.input} value={birthTime} onChangeText={setBirthTime}
            placeholder="HH:MM" placeholderTextColor="#94A3B8"
            autoCapitalize="none" autoCorrect={false} keyboardType="numbers-and-punctuation"
          />
          <Text style={styles.formLabel}>Place of Birth</Text>
          <Pressable style={styles.cityBtn} onPress={() => setShowCityPicker(s => !s)}>
            <Text style={styles.cityBtnText}>📍 {birthCity.name}, {birthCity.country}</Text>
            <Text style={{ color: "#6366F1" }}>{showCityPicker ? "▲" : "▼"}</Text>
          </Pressable>

          {showCityPicker && (
            <View style={styles.pickerBox}>
              <TextInput
                style={[styles.input, { marginBottom: 6 }]}
                placeholder="Search city…"
                placeholderTextColor="#94A3B8"
                value={filter} onChangeText={setFilter}
              />
              <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                {filteredCities.map((c) => {
                  const idx = CITIES.indexOf(c);
                  return (
                    <Pressable key={`${c.name}-${idx}`} style={styles.pickerRow} onPress={() => { setPickedCityIdx(idx); setShowCityPicker(false); setFilter(""); }}>
                      <Text style={styles.pickerName}>{c.name}</Text>
                      <Text style={styles.pickerCountry}>{c.country}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>🔮 Calculate Kundali</Text>
          </Pressable>
        </View>

        {/* Result */}
        {kundali && (
          <>
            <Section title="Lagna Chart (D-1)">
              <View style={styles.chartWrapper}>
                <NorthIndianChart data={kundali} />
              </View>
            </Section>

            {interp && (
              <View style={styles.interpCard}>
                <Text style={styles.interpEyebrow}>LAGNA READING</Text>
                <Text style={styles.interpTitle}>{interp.title}</Text>
                <Text style={styles.interpBody}>{interp.body}</Text>
              </View>
            )}

            <View style={styles.tilesGrid}>
              {moon && <InfoTile icon="🌙" label="Moon Sign" value={moon.sign} sub={moon.signEn} />}
              {sun &&  <InfoTile icon="☀️" label="Sun Sign"  value={sun.sign}  sub={sun.signEn} />}
              <InfoTile icon="⭐" label="Janma Nakshatra" value={kundali.moonNakshatra} sub={`Pada ${kundali.moonNakshatraPada}`} />
              <InfoTile icon="🔺" label="Navamsa Lagna"  value={kundali.navamsaLagna} sub="D-9 Chart" />
            </View>

            <Section title="Planetary Positions">
              <PlanetTable data={kundali} />
            </Section>

            <Section title="Vimshottari Dasha">
              <DashaSection data={kundali} />
            </Section>

            <View style={styles.disclaim}>
              <Text style={styles.disclaimText}>
                ℹ️ Computations use Lahiri ayanamsa with simplified mean-motion for outer planets.
                Suitable for sign and house placement; consult a Jyotishi for predictions.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kHeader: { paddingHorizontal: 20, paddingBottom: 16 },
  kHeaderEyebrow: { color: "#C4B5FD", fontSize: 11, letterSpacing: 1.5, fontFamily: "Inter_600SemiBold" },
  kHeaderTitle: { color: "#fff", fontSize: 26, fontFamily: "Inter_700Bold", marginTop: 2 },
  kHeaderSub: { color: "#DDD6FE", fontSize: 12, marginTop: 4, fontFamily: "Inter_400Regular" },

  formCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E2E8F0" },
  formTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1E293B", marginBottom: 12 },
  formLabel: { fontSize: 11, color: "#6366F1", fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginTop: 6, marginBottom: 4, textTransform: "uppercase" },
  input: {
    borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, fontFamily: "Inter_500Medium", color: "#1E293B", backgroundColor: "#fff",
  },
  cityBtn: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  cityBtnText: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#1E293B" },
  pickerBox: { marginTop: 8, padding: 8, backgroundColor: "#F8FAFC", borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  pickerRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E2E8F0" },
  pickerName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#1E293B" },
  pickerCountry: { fontSize: 11, color: "#64748B", fontFamily: "Inter_400Regular" },

  errorText: { color: "#DC2626", fontSize: 12, marginTop: 8, fontFamily: "Inter_500Medium" },
  calcBtn: { marginTop: 14, backgroundColor: "#4338CA", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  calcBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },

  sectionTitle: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#4338CA", letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 },

  chartWrapper: { backgroundColor: "#fff", padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#E0E7FF", alignItems: "center" },

  interpCard: { backgroundColor: "#4338CA", borderRadius: 16, padding: 16, marginTop: 14 },
  interpEyebrow: { color: "#C7D2FE", fontSize: 10, letterSpacing: 1.5, fontFamily: "Inter_600SemiBold" },
  interpTitle: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 4 },
  interpBody: { color: "#E0E7FF", fontSize: 13, lineHeight: 19, marginTop: 6, fontFamily: "Inter_400Regular" },

  tilesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  infoTile: { flexBasis: "48%", flexGrow: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#E0E7FF" },
  infoLabel: { fontSize: 10, color: "#6366F1", fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },
  infoValue: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1E293B", marginTop: 2 },
  infoSub: { fontSize: 10, color: "#94A3B8", fontFamily: "Inter_400Regular" },

  table: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E0E7FF", overflow: "hidden" },
  tableRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E0E7FF" },
  tableHeaderRow: { backgroundColor: "#EEF2FF", borderTopWidth: 0 },
  tCell: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#334155" },
  tHead: { fontFamily: "Inter_700Bold", color: "#4338CA", fontSize: 10, textTransform: "uppercase" },
  colPlanet: { flex: 2.2 },
  colSign: { flex: 1.4 },
  colHouse: { flex: 0.6 },
  colNak: { flex: 2.2 },
  colDeg: { flex: 1.2 },

  dashaCurrent: { backgroundColor: "#EEF2FF", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#C7D2FE" },
  dashaLabel: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#4338CA", letterSpacing: 1 },
  dashaCurrentRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  dashaTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1E1B4B" },
  dashaDates: { fontSize: 11, color: "#64748B", marginTop: 2, fontFamily: "Inter_400Regular" },
  dashaYears: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#4338CA" },
  dashaPct: { fontSize: 10, color: "#64748B", fontFamily: "Inter_400Regular" },
  barTrack: { backgroundColor: "#C7D2FE", height: 6, borderRadius: 4, marginTop: 10, overflow: "hidden" },
  barFill: { backgroundColor: "#6366F1", height: 6, borderRadius: 4 },

  subHead: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#4338CA", letterSpacing: 0.8, marginBottom: 6, paddingHorizontal: 4, textTransform: "uppercase" },
  listCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E0E7FF", overflow: "hidden" },
  antarRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E0E7FF" },
  antarLord: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#334155" },
  antarBadge: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff", backgroundColor: "#F59E0B", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, overflow: "hidden" },
  antarDate: { marginLeft: "auto", fontSize: 10, color: "#94A3B8", fontFamily: "Inter_400Regular" },

  timelineRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, backgroundColor: "#F1F5F9" },
  timelineLord: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#334155", width: 70 },
  timelineYrs: { fontSize: 10, color: "#94A3B8", fontFamily: "Inter_400Regular" },
  timelineDate: { marginLeft: "auto", fontSize: 10, color: "#94A3B8", fontFamily: "Inter_400Regular" },

  disclaim: { backgroundColor: "#FEF3C7", borderColor: "#FCD34D", borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 18 },
  disclaimText: { fontSize: 11, color: "#92400E", lineHeight: 16, fontFamily: "Inter_400Regular" },
});
