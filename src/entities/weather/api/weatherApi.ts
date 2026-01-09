import { apiRequest } from "@/shared/api";
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  WeatherData,
  HourlyForecast
} from "@/entities/weather/model/types";

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> {
  return apiRequest<CurrentWeatherResponse>("/weather", {
    params: { lat, lon }
  });
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  return apiRequest<ForecastResponse>("/forecast", {
    params: { lat, lon }
  });
}

export async function fetchWeatherData(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const [current, forecast] = await Promise.all([
    fetchCurrentWeather(lat, lon),
    fetchForecast(lat, lon)
  ]);

  const todayForecasts = getTodayForecasts(forecast);
  const { tempMin, tempMax } = getDailyMinMax(current, todayForecasts);

  const hourlyForecast: HourlyForecast[] = forecast.list
    .slice(0, 8)
    .map((item) => ({
      time: formatTime(item.dt),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description
    }));

  return {
    location: current.name,
    currentTemp: Math.round(current.main.temp),
    tempMin,
    tempMax,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    windSpeed: current.wind.speed,
    hourlyForecast
  };
}

function getTodayForecasts(forecast: ForecastResponse) {
  const today = new Date().toDateString();
  return forecast.list.filter((item) => {
    const itemDate = new Date(item.dt * 1000).toDateString();
    return itemDate === today;
  });
}

function getDailyMinMax(
  current: CurrentWeatherResponse,
  todayForecasts: ForecastResponse["list"]
) {
  if (todayForecasts.length === 0) {
    return {
      tempMin: Math.round(current.main.temp_min),
      tempMax: Math.round(current.main.temp_max)
    };
  }

  const temps = todayForecasts.map((f) => f.main.temp);
  temps.push(current.main.temp);

  return {
    tempMin: Math.round(Math.min(...temps, current.main.temp_min)),
    tempMax: Math.round(Math.max(...temps, current.main.temp_max))
  };
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
