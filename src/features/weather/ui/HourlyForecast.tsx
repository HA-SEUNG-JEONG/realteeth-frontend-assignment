import type { HourlyForecast as HourlyForecastType } from "@/entities/weather";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastProps {
  forecasts: HourlyForecastType[];
}

function HourlyForecast({ forecasts }: HourlyForecastProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
      <h3 className="font-semibold mb-3">시간별 날씨</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="flex flex-col items-center min-w-[70px] bg-white/5 rounded-xl p-3"
          >
            <span className="text-sm">{forecast.time}</span>
            <WeatherIcon
              icon={forecast.icon}
              description={forecast.description}
              size="sm"
            />
            <span className="font-semibold">{forecast.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
