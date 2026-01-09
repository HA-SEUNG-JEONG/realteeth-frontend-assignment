import { useRef, useEffect } from "react";

interface LocationSearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions: string[];
  onSelectLocation: (fullName: string) => void;
  isLoading: boolean;
  onClear: () => void;
  hasSelection: boolean;
}

export function LocationSearchInput({
  query,
  onQueryChange,
  suggestions,
  onSelectLocation,
  isLoading,
  onClear,
  hasSelection
}: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasSelection && inputRef.current) {
      inputRef.current.blur();
    }
  }, [hasSelection]);

  const formatDisplayName = (fullName: string) => {
    return fullName.replace(/-/g, " ");
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="장소 검색 (예: 강남, 해운대, 제주)"
          className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent" />
          </div>
        )}
        {hasSelection && !isLoading && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="검색 초기화"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-gray-800 border border-white/20 overflow-hidden shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                onClick={() => onSelectLocation(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
              >
                {formatDisplayName(suggestion)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
