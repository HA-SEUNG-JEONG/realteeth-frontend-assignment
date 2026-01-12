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

interface KakaoAddressDocument {
  address_name: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  address_type: string;
  address?: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
}

interface KakaoAddressResponse {
  meta: {
    total_count: number;
  };
  documents: KakaoAddressDocument[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export async function getCoordinatesByAddress(
  address: string
): Promise<Coordinates | null> {
  const url = new URL(`${config.kakaoLocalBaseUrl}/search/address`);
  url.searchParams.set("query", address);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${config.kakaoApiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Kakao API Error: ${response.status}`);
  }

  const data: KakaoAddressResponse = await response.json();

  if (data.documents.length === 0) {
    return null;
  }

  const { x, y } = data.documents[0];
  return {
    lat: parseFloat(y),
    lng: parseFloat(x)
  };
}
