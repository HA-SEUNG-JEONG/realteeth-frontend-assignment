import type { FavoriteLocation } from "@/entities/favorites";
import { MAX_FAVORITES } from "@/entities/favorites";
import FavoriteCard from "./FavoriteCard";

interface FavoriteListProps {
  favorites: FavoriteLocation[];
  onUpdateAlias: (id: string, alias: string) => void;
  onRemove: (id: string) => void;
}

function FavoriteList({
  favorites,
  onUpdateAlias,
  onRemove
}: FavoriteListProps) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">즐겨찾기</h2>
        <span className="text-base font-semibold text-primary">
          {favorites.length}/{MAX_FAVORITES}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onUpdateAlias={onUpdateAlias}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

export default FavoriteList;
