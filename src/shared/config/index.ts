const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error(
    "[Config] OPENWEATHER_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요."
  );
}

export const config = {
  openWeatherApiKey: apiKey ?? "",
  openWeatherBaseUrl: "https://api.openweathermap.org/data/2.5"
} as const;
