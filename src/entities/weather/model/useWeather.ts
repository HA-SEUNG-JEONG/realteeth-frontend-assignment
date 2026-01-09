import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "@/entities/weather/api/weatherApi";

interface UseWeatherOptions {
  lat: number;
  lon: number;
  enabled?: boolean;
}

export function useWeather({ lat, lon, enabled = true }: UseWeatherOptions) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeatherData(lat, lon),
    enabled: enabled && lat !== 0 && lon !== 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
  });
}
