import { useWeather } from "@/entities/weather";
import { Card, Skeleton } from "@/shared";
import CurrentWeather from "./CurrentWeather";
import HourlyForecast from "./HourlyForecast";

interface WeatherWidgetProps {
  lat: number;
  lon: number;
}

function WeatherWidget({ lat, lon }: WeatherWidgetProps) {
  const { data: weather, isLoading, error } = useWeather({ lat, lon });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>
        <Card className="p-4">
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-[70px] rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-accent-red/10 border-accent-red/20 p-6 text-center">
        <p className="text-accent-red">날씨 정보를 불러오는데 실패했습니다.</p>
        <p className="text-accent-red/70 text-sm mt-2">
          잠시 후 다시 시도해주세요.
        </p>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="bg-muted/10 border-muted/20 p-6 text-center">
        <p className="text-muted">해당 장소의 정보가 제공되지 않습니다.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <CurrentWeather weather={weather} />
      <HourlyForecast forecasts={weather.hourlyForecast} />
    </div>
  );
}

export default WeatherWidget;
