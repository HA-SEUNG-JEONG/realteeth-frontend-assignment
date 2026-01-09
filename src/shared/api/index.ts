import { config } from "@/shared/config";

interface RequestOptions {
  params?: Record<string, string | number>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = new URL(`${config.openWeatherBaseUrl}${endpoint}`);

  url.searchParams.set("appid", config.openWeatherApiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "kr");

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
