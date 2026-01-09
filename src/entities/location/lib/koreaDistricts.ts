import koreaDistrictsData from "../../../../korea_districts.json";

interface CityData {
  en: string;
  lat: number;
  lon: number;
}

interface KoreaDistrictsData {
  cities: Record<string, CityData>;
  districts: string[];
}

const data = koreaDistrictsData as KoreaDistrictsData;

export function searchDistricts(query: string, limit: number = 10): string[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  return data.districts
    .filter((district) => {
      const parts = district.split("-");
      return parts.some((part) => part.toLowerCase().includes(normalizedQuery));
    })
    .slice(0, limit);
}

export function parseDistrictName(fullName: string): {
  city: string;
  district?: string;
  dong?: string;
} {
  const parts = fullName.split("-");
  return {
    city: parts[0],
    district: parts[1],
    dong: parts[2]
  };
}

export function getCityCoordinates(fullName: string): { lat: number; lon: number } | null {
  const city = fullName.split("-")[0];
  const cityData = data.cities[city];

  if (!cityData) {
    return null;
  }

  return {
    lat: cityData.lat,
    lon: cityData.lon
  };
}
