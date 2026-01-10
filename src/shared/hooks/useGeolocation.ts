import { useQuery } from "@tanstack/react-query";

interface GeolocationResult {
  lat: number;
  lon: number;
  error: string | null;
  loading: boolean;
}

function getErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "위치 정보 접근이 거부되었습니다.";
    case error.POSITION_UNAVAILABLE:
      return "위치 정보를 사용할 수 없습니다.";
    case error.TIMEOUT:
      return "위치 정보 요청 시간이 초과되었습니다.";
    default:
      return "위치 정보를 가져올 수 없습니다.";
  }
}

function getGeolocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("브라우저가 위치 정보를 지원하지 않습니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(new Error(getErrorMessage(error))),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}

export function useGeolocation(): GeolocationResult {
  const { data, error, isLoading } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    staleTime: 300000,
    retry: false
  });

  return {
    lat: data?.latitude ?? 0,
    lon: data?.longitude ?? 0,
    error: error instanceof Error ? error.message : null,
    loading: isLoading
  };
}
