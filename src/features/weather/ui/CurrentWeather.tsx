import type { WeatherData } from "@/entities/weather";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  weather: WeatherData;
}

export function CurrentWeather({ weather }: CurrentWeatherProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">{weather.location}</h2>

        <div className="flex items-center justify-center">
          <WeatherIcon
            icon={weather.icon}
            description={weather.description}
            size="lg"
          />
          <span className="text-6xl font-bold ml-2">
            {weather.currentTemp}°
          </span>
        </div>

        <p className="text-lg capitalize mt-2">{weather.description}</p>

        <div className="flex gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="text-blue-200">최저</span>
            <span className="font-semibold">{weather.tempMin}°</span>
          </span>
          <span className="text-blue-300">|</span>
          <span className="flex items-center gap-1">
            <span className="text-blue-200">최고</span>
            <span className="font-semibold">{weather.tempMax}°</span>
          </span>
        </div>

        <div className="flex gap-6 mt-4 text-sm text-blue-100">
          <span>습도 {weather.humidity}%</span>
          <span>풍속 {weather.windSpeed}m/s</span>
        </div>
      </div>
    </div>
  );
}
