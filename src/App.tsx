import { QueryProvider } from "@/app/providers";

import { useGeolocation } from "@/shared/hooks";
import { useLocationSearch } from "@/entities/location";
import LocationSearchInput from "./features/location-search/ui/LocationSearchInput";
import WeatherWidget from "./features/weather/ui/WeatherWidget";

function WeatherApp() {
  const { lat, lon, loading, error } = useGeolocation();
  const {
    query,
    setQuery,
    autoCompleteResult,
    isLoading: isSearchLoading,
    selectLocation,
    selectedLocation,
    clearSelection
  } = useLocationSearch();

  const displayLat = selectedLocation?.lat ?? lat;
  const displayLon = selectedLocation?.lon ?? lon;
  const hasCoordinates = displayLat !== 0 && displayLon !== 0;

  const isInitialLoading = loading && !selectedLocation;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">날씨</h1>

        <div className="mb-6">
          <LocationSearchInput
            query={query}
            onQueryChange={setQuery}
            autoCompleteItem={autoCompleteResult}
            onSelectLocation={selectLocation}
            isLoading={isSearchLoading}
            onClear={clearSelection}
          />
        </div>

        {selectedLocation && (
          <div className="mb-4 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl">
            <p className="text-blue-600 font-semibold text-sm text-center">
              {selectedLocation.fullName.replace(/-/g, " ")}
            </p>
          </div>
        )}

        {isInitialLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
            <p className="text-gray-400">현재 위치를 확인하는 중...</p>
          </div>
        )}

        {!isInitialLoading && !hasCoordinates && error && !selectedLocation && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
            <p className="text-yellow-400 mb-2">{error}</p>
            <p className="text-gray-400 text-sm">
              위치 권한을 허용하거나 장소를 검색하여 날씨를 확인하세요.
            </p>
          </div>
        )}

        {hasCoordinates && <WeatherWidget lat={displayLat} lon={displayLon} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryProvider>
      <WeatherApp />
    </QueryProvider>
  );
}

export default App;
