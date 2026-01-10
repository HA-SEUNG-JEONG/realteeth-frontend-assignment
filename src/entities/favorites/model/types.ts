export interface FavoriteLocation {
  id: string;
  fullName: string;
  alias: string;
  lat: number;
  lon: number;
  createdAt: number;
}

export const MAX_FAVORITES = 6;
