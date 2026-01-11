import { apiRequest } from "@/shared/api";
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  WeatherData,
  HourlyForecast
} from "@/entities/weather/model/types";
import {
  getTodayForecasts,
  getDailyMinMax,
  formatTime
} from "@/entities/weather/lib/weatherUtils";

const MAX_FORECAST_COUNT = 12;

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> {
  return apiRequest<CurrentWeatherResponse>("/weather", {
    params: { lat, lon }
  });
}

export async function fetchForecast(lat: number, lon: number) {
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

  const maxForecastList = forecast.list.slice(0, MAX_FORECAST_COUNT);

  const hourlyForecast: HourlyForecast[] = maxForecastList.map((item) => ({
    time: formatTime(item.dt),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    description: item.weather[0].description
  }));

  return {
    location: current.name,
    currentTemp: current.main.temp,
    tempMin,
    tempMax,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed),
    hourlyForecast
  };
}
