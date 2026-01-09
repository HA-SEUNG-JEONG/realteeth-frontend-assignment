import { useWeather } from "@/entities/weather";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyForecast } from "./HourlyForecast";

interface WeatherWidgetProps {
  lat: number;
  lon: number;
}

export function WeatherWidget({ lat, lon }: WeatherWidgetProps) {
  const { data: weather, isLoading, error } = useWeather({ lat, lon });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
        <p className="text-red-400">날씨 정보를 불러오는데 실패했습니다.</p>
        <p className="text-red-300 text-sm mt-2">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-6 text-center">
        <p className="text-gray-400">해당 장소의 정보가 제공되지 않습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <CurrentWeather weather={weather} />
      <HourlyForecast forecasts={weather.hourlyForecast} />
    </div>
  );
}
