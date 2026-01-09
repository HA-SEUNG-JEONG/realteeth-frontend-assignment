import { useState, useCallback, useMemo } from "react";
import { searchDistricts, getCityCoordinates } from "../lib/koreaDistricts";
import type { LocationSearchResult } from "./types";

interface UseLocationSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  autoCompleteResult: string[];
  isLoading: boolean;
  selectLocation: (fullName: string) => void;
  selectedLocation: LocationSearchResult | null;
  clearSelection: () => void;
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQueryInternal] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  console.log(setQueryInternal, "setQueryInternal");

  const setQuery = useCallback((newQuery: string) => {
    setQueryInternal(newQuery);
    setSelectedDistrict(null);
  }, []);

  console.log(setQuery, "setQuery");

  const autoCompleteResult = useMemo(() => {
    if (selectedDistrict) return [];
    return searchDistricts(query, 10);
  }, [query, selectedDistrict]);

  const selectLocation = useCallback((fullName: string) => {
    setSelectedDistrict(fullName);
    setQueryInternal(fullName.replace(/-/g, " "));
  }, []);

  const clearSelection = () => {
    setSelectedDistrict(null);
    setQueryInternal("");
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
    setQuery,
    autoCompleteResult,
    isLoading: false,
    selectLocation,
    selectedLocation,
    clearSelection
  };
}
