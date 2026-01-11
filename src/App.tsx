import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Star } from "lucide-react";
import { QueryProvider } from "@/app/providers";

import { useGeolocation, Button, Card, Skeleton } from "@/shared";
import { useLocationSearch } from "@/entities/location";
import { useFavorites, MAX_FAVORITES } from "@/entities/favorites";
import LocationSearchInput from "./features/location-search/ui/LocationSearchInput";
import { WeatherWidget } from "@/features/weather";
import { FavoriteList } from "./features/favorites";
import DetailPage from "./pages/DetailPage";

function HomePage() {
  const { lat, lon, loading, error } = useGeolocation();
  const {
    query,
    setQuery,
    autoCompleteResult,
    selectLocation,
    selectedLocation,
    clearSelection
  } = useLocationSearch();

  const {
    favorites,
    addFavorite,
    removeFavorite,
    updateAlias,
    isFavorite,
    canAddMore
  } = useFavorites();

  const displayLat = selectedLocation?.lat ?? lat;
  const displayLon = selectedLocation?.lon ?? lon;
  const hasCoordinates = displayLat !== 0 && displayLon !== 0;

  const isInitialLoading = loading && !selectedLocation;

  const handleAddFavorite = () => {
    if (!selectedLocation || !canAddMore) return;

    const defaultAlias =
      selectedLocation.fullName.split("-").pop() || selectedLocation.name;
    addFavorite({
      fullName: selectedLocation.fullName,
      alias: defaultAlias,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon
    });
  };

  const isCurrentLocationFavorite = selectedLocation
    ? isFavorite(selectedLocation.fullName)
    : false;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto p-4 rounded-md">
        <LocationSearchInput
          query={query}
          onQueryChange={setQuery}
          autoCompleteItem={autoCompleteResult}
          onSelectLocation={selectLocation}
          onClear={clearSelection}
          className="mb-6"
        />

        <FavoriteList
          favorites={favorites}
          onUpdateAlias={updateAlias}
          onRemove={removeFavorite}
        />

        {selectedLocation && (
          <Card className="mb-4 px-4 py-2 bg-primary/20 border-primary/30 flex items-center justify-between">
            <p className="text-primary font-semibold text-sm">
              {selectedLocation.fullName.replace(/-/g, " ")}
            </p>
            {!isCurrentLocationFavorite && (
              <Button
                onClick={handleAddFavorite}
                disabled={!canAddMore}
                variant="secondary"
                size="sm"
                className={
                  canAddMore
                    ? "bg-accent-yellow/20 text-accent-yellow hover:bg-accent-yellow/30"
                    : "bg-muted/20 text-muted cursor-not-allowed"
                }
              >
                <Star className="w-4 h-4" />
                {canAddMore
                  ? "즐겨찾기"
                  : `가득 참 (${MAX_FAVORITES}/${MAX_FAVORITES})`}
              </Button>
            )}
            {isCurrentLocationFavorite && (
              <span className="text-accent-yellow text-sm flex items-center gap-1">
                <Star className="w-4 h-4" fill="currentColor" />
                즐겨찾기됨
              </span>
            )}
          </Card>
        )}

        {isInitialLoading && (
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </Card>
        )}

        {!isInitialLoading && !hasCoordinates && error && !selectedLocation && (
          <Card className="bg-accent-yellow/10 border-accent-yellow/20 p-6 text-center">
            <p className="text-accent-yellow mb-2">{error}</p>
            <p className="text-muted text-sm">
              위치 권한을 허용하거나 장소를 검색하여 날씨를 확인하세요.
            </p>
          </Card>
        )}

        {hasCoordinates && <WeatherWidget lat={displayLat} lon={displayLon} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
