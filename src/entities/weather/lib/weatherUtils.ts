import type {
  CurrentWeatherResponse,
  ForecastResponse
} from "@/entities/weather/model/types";

export function getTodayForecasts(forecast: ForecastResponse) {
  const today = new Date().toDateString();
  return forecast.list.filter((item) => {
    const itemDate = new Date(item.dt * 1000).toDateString();
    return itemDate === today;
  });
}

export function getDailyMinMax(
  current: CurrentWeatherResponse,
  todayForecasts: ForecastResponse["list"]
) {
  if (todayForecasts.length === 0) {
    return {
      tempMin: current.main.temp_min,
      tempMax: current.main.temp_max
    };
  }

  const temps = todayForecasts.map((f) => f.main.temp);
  temps.push(current.main.temp);

  return {
    tempMin: Math.round(current.main.temp_min * 10) / 10,
    tempMax: Math.round(current.main.temp_max * 10) / 10
  };
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
