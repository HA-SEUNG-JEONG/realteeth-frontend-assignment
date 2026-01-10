import type { WeatherData } from "@/entities/weather";
import { Card } from "@/shared";
import WeatherIcon from "./WeatherIcon";

interface CurrentWeatherProps {
  weather: WeatherData;
}

function CurrentWeather({ weather }: CurrentWeatherProps) {
  return (
    <Card className="bg-primary text-primary-foreground p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center lg:items-start">
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
        </div>

        <div className="flex flex-col items-center lg:items-end mt-4 lg:mt-0">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="text-primary-foreground/70 text-base">최저</span>
              <span className="font-semibold text-base">{weather.tempMin}°</span>
            </span>
            <span className="text-primary-foreground/50">|</span>
            <span className="flex items-center gap-1">
              <span className="text-primary-foreground/70 text-base">최고</span>
              <span className="font-semibold text-base">{weather.tempMax}°</span>
            </span>
          </div>
          <div className="flex gap-6 mt-4 text-sm text-primary-foreground/70">
            <span className="text-base">습도 {weather.humidity}%</span>
            <span className="text-base">풍속 {weather.windSpeed}m/s</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CurrentWeather;
