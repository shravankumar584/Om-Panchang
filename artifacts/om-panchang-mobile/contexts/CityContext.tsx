import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CITIES, type City } from "@/lib/panchangData";

const DEFAULT_CITY = CITIES.find(c => c.name === "New York") ?? CITIES[0]!;
const STORAGE_KEY = "om_panchang_city";

interface CityContextType {
  selectedCity: City;
  setCity: (city: City) => void;
  cities: City[];
}

const CityContext = createContext<CityContextType>({
  selectedCity: DEFAULT_CITY,
  setCity: () => {},
  cities: CITIES,
});

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val) {
        try {
          const parsed = JSON.parse(val) as City;
          const match = CITIES.find(c => c.name === parsed.name);
          if (match) setSelectedCity(match);
        } catch {}
      }
    });
  }, []);

  const setCity = useCallback((city: City) => {
    setSelectedCity(city);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(city));
  }, []);

  return (
    <CityContext.Provider value={{ selectedCity, setCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
