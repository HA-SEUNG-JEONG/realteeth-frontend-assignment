import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFavorites } from "@/entities/favorites";
import { useWeather } from "@/entities/weather";
import { Button, Card, Skeleton } from "@/shared";
import WeatherIcon from "@/features/weather/ui/WeatherIcon";
import HourlyForecast from "@/features/weather/ui/HourlyForecast";

function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const favorite = favorites.find((f) => f.id === id);

  const { data: weather, isLoading, error } = useWeather({
    lat: favorite?.lat ?? 0,
    lon: favorite?.lon ?? 0,
    enabled: !!favorite
  });

  const handleBack = () => {
    navigate("/");
  };

  if (!favorite) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto">
          <Card className="bg-accent-yellow/10 border-accent-yellow/20 p-6 text-center">
            <p className="text-accent-yellow mb-4">즐겨찾기를 찾을 수 없습니다.</p>
            <Button onClick={handleBack}>돌아가기</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4 text-muted hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로가기
        </Button>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{favorite.alias}</h1>
          <p className="text-muted text-sm">
            {favorite.fullName.replace(/-/g, " ")}
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-20 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
            <Card className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </Card>
          </div>
        )}

        {error && (
          <Card className="bg-accent-red/10 border-accent-red/20 p-6 text-center">
            <p className="text-accent-red">날씨 정보를 불러오는데 실패했습니다.</p>
          </Card>
        )}

        {weather && (
          <div className="space-y-4">
            <Card className="bg-primary text-primary-foreground p-6">
              <div className="flex flex-col items-center lg:flex-row lg:justify-between">
                <div className="flex flex-col items-center lg:items-start">
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

                <div className="flex gap-4 mt-4 lg:mt-0 text-sm">
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
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">상세 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-3">
                  <p className="text-muted text-sm">습도</p>
                  <p className="text-xl font-semibold">{weather.humidity}%</p>
                </div>
                <div className="bg-card rounded-xl p-3">
                  <p className="text-muted text-sm">풍속</p>
                  <p className="text-xl font-semibold">{weather.windSpeed}m/s</p>
                </div>
              </div>
            </Card>

            <HourlyForecast forecasts={weather.hourlyForecast} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
