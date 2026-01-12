import { useState, useMemo } from "react";
import { searchDistricts } from "@/shared/lib/koreaDistricts";
import { getCoordinatesByAddress } from "@/shared/api";
import type { LocationSearchResult } from "./types";

interface UseLocationSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  autoCompleteResult: string[];
  selectLocation: (fullName: string) => void;
  selectedLocation: LocationSearchResult | null;
  clearSelection: () => void;
  isLoadingCoordinates: boolean;
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResult | null>(null);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setSelectedLocation(null);
  };

  const autoCompleteResult = useMemo(() => {
    if (selectedLocation) return [];
    return searchDistricts(query, 10);
  }, [query, selectedLocation]);

  const selectLocation = async (fullName: string) => {
    setQuery(fullName.replace(/-/g, " "));
    setIsLoadingCoordinates(true);

    try {
      const addressQuery = fullName.replace(/-/g, " ");
      const coordinates = await getCoordinatesByAddress(addressQuery);

      if (coordinates) {
        setSelectedLocation({
          name: fullName.split("-").pop() || fullName,
          fullName,
          lat: coordinates.lat,
          lon: coordinates.lng
        });
      }
    } catch (error) {
      console.error("좌표 조회 실패:", error);
    } finally {
      setIsLoadingCoordinates(false);
    }
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setQuery("");
  };

  return {
    query,
    setQuery: handleQueryChange,
    autoCompleteResult,
    selectLocation,
    selectedLocation,
    clearSelection,
    isLoadingCoordinates
  };
}
