import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFavorites } from "@/entities/favorites";
import { useWeather } from "@/entities/weather";
import { Button, Card, Skeleton } from "@/shared";
import { CurrentWeather, HourlyForecast } from "@/features/weather";

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
            <CurrentWeather weather={weather} />
            <HourlyForecast forecasts={weather.hourlyForecast} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
