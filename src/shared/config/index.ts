const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const kakaoApiKey = import.meta.env.VITE_REST_API_KEY;

if (!openWeatherApiKey) {
  console.error(
    "[Config] OPENWEATHER_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요."
  );
}

if (!kakaoApiKey) {
  console.error(
    "[Config] KAKAO_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요."
  );
}

export const config = {
  openWeatherApiKey: openWeatherApiKey ?? "",
  openWeatherBaseUrl: "https://api.openweathermap.org/data/2.5",
  kakaoApiKey: kakaoApiKey ?? "",
  kakaoLocalBaseUrl: "https://dapi.kakao.com/v2/local"
} as const;
