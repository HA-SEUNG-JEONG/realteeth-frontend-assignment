import { useState, useEffect } from "react";

interface GeolocationState {
  lat: number;
  lon: number;
  error: string | null;
  loading: boolean;
}

const getInitialState = (): GeolocationState => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return {
      lat: 0,
      lon: 0,
      error: "브라우저가 위치 정보를 지원하지 않습니다.",
      loading: false
    };
  }
  return {
    lat: 0,
    lon: 0,
    error: null,
    loading: true
  };
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(getInitialState);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          loading: false
        });
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "위치 정보 접근이 거부되었습니다.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "위치 정보를 사용할 수 없습니다.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  return state;
}
