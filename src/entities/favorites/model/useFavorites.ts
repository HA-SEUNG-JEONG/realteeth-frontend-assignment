import { useState } from "react";
import type { FavoriteLocation } from "./types";
import { MAX_FAVORITES } from "./types";

const STORAGE_KEY = "weather-favorites";

function loadFavorites(): FavoriteLocation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteLocation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

interface UseFavoritesReturn {
  favorites: FavoriteLocation[];
  addFavorite: (location: Omit<FavoriteLocation, "id" | "createdAt">) => void;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
  isFavorite: (fullName: string) => boolean;
  canAddMore: boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(loadFavorites);

  const addFavorite = (location: Omit<FavoriteLocation, "id" | "createdAt">) => {
    setFavorites((current) => {
      if (current.length >= MAX_FAVORITES) {
        return current;
      }

      if (current.some((f) => f.fullName === location.fullName)) {
        return current;
      }

      const newFavorite: FavoriteLocation = {
        ...location,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };

      const updated = [...current, newFavorite];
      saveFavorites(updated);
      return updated;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((current) => {
      const updated = current.filter((f) => f.id !== id);
      saveFavorites(updated);
      return updated;
    });
  };

  const updateAlias = (id: string, alias: string) => {
    setFavorites((current) => {
      const updated = current.map((f) => (f.id === id ? { ...f, alias } : f));
      saveFavorites(updated);
      return updated;
    });
  };

  const isFavorite = (fullName: string) =>
    favorites.some((f) => f.fullName === fullName);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateAlias,
    isFavorite,
    canAddMore: favorites.length < MAX_FAVORITES
  };
}
