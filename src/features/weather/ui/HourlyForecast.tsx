import type { HourlyForecast as HourlyForecastType } from "@/entities/weather";
import { Card } from "@/shared";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastProps {
  forecasts: HourlyForecastType[];
}

function HourlyForecast({ forecasts }: HourlyForecastProps) {
  return (
    <Card className="p-3">
      <h3 className="font-semibold mb-3 text-gray-900">시간별 날씨</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 xl:grid-cols-8 lg:overflow-visible">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="flex flex-col items-center min-w-[70px] bg-card rounded-xl p-3"
          >
            <span className="text-sm text-muted">{forecast.time}</span>
            <WeatherIcon
              icon={forecast.icon}
              description={forecast.description}
              size="sm"
            />
            <span className="font-semibold text-gray-900">
              {forecast.temp}°
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default HourlyForecast;
