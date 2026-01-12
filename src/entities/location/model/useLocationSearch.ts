import { useState, useMemo } from "react";
import {
  searchDistricts,
  getCityCoordinates
} from "@/shared/lib/koreaDistricts";
import type { LocationSearchResult } from "./types";

interface UseLocationSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  autoCompleteResult: string[];
  selectLocation: (fullName: string) => void;
  selectedLocation: LocationSearchResult | null;
  clearSelection: () => void;
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setSelectedDistrict(null);
  };

  const autoCompleteResult = useMemo(() => {
    if (selectedDistrict) return [];
    return searchDistricts(query, 10);
  }, [query, selectedDistrict]);

  const selectLocation = (fullName: string) => {
    setSelectedDistrict(fullName);
    setQuery(fullName.replace(/-/g, " "));
  };

  const clearSelection = () => {
    setSelectedDistrict(null);
    setQuery("");
  };

  const selectedLocation = useMemo<LocationSearchResult | null>(() => {
    if (!selectedDistrict) return null;

    const coordinates = getCityCoordinates(selectedDistrict);
    if (!coordinates) return null;

    const { lat, lon } = coordinates;

    return {
      name: selectedDistrict.split("-").pop() || selectedDistrict,
      fullName: selectedDistrict,
      lat,
      lon
    };
  }, [selectedDistrict]);

  return {
    query,
    setQuery: handleQueryChange,
    autoCompleteResult,
    selectLocation,
    selectedLocation,
    clearSelection
  };
}
