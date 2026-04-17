import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { CITIES, type City } from "@/lib/panchangData";

const STORAGE_KEY = "om_panchang_city";
const LOCATION_TRIED_KEY = "om_panchang_location_tried";

function getDefaultCityByTimezone(): City {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith("America/")) {
      const us = CITIES.find(c => c.timezone === tz);
      if (us) return us;
      return CITIES.find(c => c.name === "New York") ?? CITIES[0]!;
    }
    if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) {
      return CITIES.find(c => c.name === "Delhi") ?? CITIES[0]!;
    }
    if (tz.startsWith("Europe/")) {
      return CITIES.find(c => c.name === "London") ?? CITIES[0]!;
    }
    if (tz.startsWith("Australia/")) {
      return CITIES.find(c => c.name === "Sydney") ?? CITIES[0]!;
    }
    const tzMatch = CITIES.find(c => c.timezone === tz);
    if (tzMatch) return tzMatch;
  } catch {}
  return CITIES.find(c => c.name === "New York") ?? CITIES[0]!;
}

const DEFAULT_CITY = getDefaultCityByTimezone();

function findNearestCity(lat: number, lon: number): City {
  let best = CITIES[0]!;
  let bestDist = Infinity;
  for (const c of CITIES) {
    const dLat = (c.lat - lat) * Math.PI / 180;
    const dLon = (c.lon - lon) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * Math.PI / 180) * Math.cos(c.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best;
}

interface CityContextType {
  selectedCity: City;
  setCity: (city: City) => void;
  cities: City[];
  detectLocation: () => Promise<{ ok: boolean; message?: string; city?: City }>;
  detectingLocation: boolean;
}

const CityContext = createContext<CityContextType>({
  selectedCity: DEFAULT_CITY,
  setCity: () => {},
  cities: CITIES,
  detectLocation: async () => ({ ok: false }),
  detectingLocation: false,
});

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const setCity = useCallback((city: City) => {
    setSelectedCity(city);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(city));
  }, []);

  const detectLocation = useCallback(async (): Promise<{ ok: boolean; message?: string; city?: City }> => {
    setDetectingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return { ok: false, message: "Location permission denied" };
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
      setCity(nearest);
      return { ok: true, city: nearest };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to get location";
      return { ok: false, message: msg };
    } finally {
      setDetectingLocation(false);
    }
  }, [setCity]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as City;
          const match = CITIES.find(c => c.name === parsed.name);
          if (match) {
            setSelectedCity(match);
            return;
          }
        } catch {}
      }
      // First-launch: try GPS once silently. If denied, keep timezone default.
      const tried = await AsyncStorage.getItem(LOCATION_TRIED_KEY);
      if (tried) return;
      await AsyncStorage.setItem(LOCATION_TRIED_KEY, "1");
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setCity(findNearestCity(pos.coords.latitude, pos.coords.longitude));
        }
      } catch {}
    })();
  }, [setCity]);

  return (
    <CityContext.Provider value={{ selectedCity, setCity, cities: CITIES, detectLocation, detectingLocation }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
