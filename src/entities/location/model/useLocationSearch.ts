import { useState, useCallback, useMemo } from "react";
import { searchDistricts, getCityCoordinates } from "../lib/koreaDistricts";
import type { LocationSearchResult } from "./types";

interface UseLocationSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: string[];
  isLoading: boolean;
  selectLocation: (fullName: string) => void;
  selectedLocation: LocationSearchResult | null;
  clearSelection: () => void;
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (selectedDistrict) return [];
    return searchDistricts(query, 10);
  }, [query, selectedDistrict]);

  const selectLocation = useCallback((fullName: string) => {
    setSelectedDistrict(fullName);
    setQuery(fullName.replace(/-/g, " "));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDistrict(null);
    setQuery("");
  }, []);

  const selectedLocation = useMemo<LocationSearchResult | null>(() => {
    if (!selectedDistrict) return null;

    const coordinates = getCityCoordinates(selectedDistrict);
    if (!coordinates) return null;

    return {
      name: selectedDistrict.split("-").pop() || selectedDistrict,
      fullName: selectedDistrict,
      lat: coordinates.lat,
      lon: coordinates.lon
    };
  }, [selectedDistrict]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading: false,
    selectLocation,
    selectedLocation,
    clearSelection
  };
}
