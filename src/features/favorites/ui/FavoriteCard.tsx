import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Pencil } from "lucide-react";
import type { FavoriteLocation } from "@/entities/favorites";
import { useWeather } from "@/entities/weather";
import {
  Card,
  Button,
  Input,
  Skeleton,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/shared";
import WeatherIcon from "@/features/weather/ui/WeatherIcon";

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  onUpdateAlias: (id: string, alias: string) => void;
  onRemove: (id: string) => void;
}

function FavoriteCard({
  favorite,
  onUpdateAlias,
  onRemove
}: FavoriteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(favorite.alias);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: weather, isLoading } = useWeather({
    lat: favorite.lat,
    lon: favorite.lon
  });

  const handleEditStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(favorite.alias);
  };

  const handleEditSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== favorite.alias) {
      onUpdateAlias(favorite.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      setEditValue(favorite.alias);
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    onRemove(favorite.id);
  };

  return (
    <Link to={`/detail/${favorite.id}`} className="block">
      <Card className="p-4 transition-colors relative group">
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-10"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="w-6 h-6 cursor-pointer rounded-full bg-accent-red/20 text-accent-red"
                aria-label="즐겨찾기 삭제"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>즐겨찾기 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  "{favorite.alias}"를 즐겨찾기에서 삭제하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={handleRemove}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex items-start justify-between pr-8">
          {isEditing ? (
            <Input
              ref={inputRef}
              autoFocus
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.preventDefault()}
              className="h-8 text-sm font-semibold"
              maxLength={20}
              name="alias"
            />
          ) : (
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-sm truncate max-w-[120px]">
                {favorite.alias}
              </h3>
              <Button
                onClick={handleEditStart}
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted"
                aria-label="이름 수정"
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-8 w-16" />
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <WeatherIcon
                icon={weather.icon}
                description={weather.description}
                size="sm"
              />
              <span className="text-2xl font-bold ml-1">
                {weather.currentTemp}°
              </span>
            </div>
            <div className="text-right text-xs text-muted">
              <div>최저 {weather.tempMin}°</div>
              <div>최고 {weather.tempMax}°</div>
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm">날씨 정보 없음</p>
        )}

        <p className="text-xs text-muted mt-2 truncate">
          {favorite.fullName.replace(/-/g, " ")}
        </p>
      </Card>
    </Link>
  );
}

export default FavoriteCard;
