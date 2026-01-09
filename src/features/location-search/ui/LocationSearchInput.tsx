import { useRef, useState, useCallback } from "react";

interface LocationSearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  autoCompleteItem: string[];
  onSelectLocation: (fullName: string) => void;
  isLoading: boolean;
  onClear: () => void;
}
function LocationSearchInput({
  query,
  onQueryChange,
  autoCompleteItem,
  onSelectLocation,
  isLoading,
  onClear
}: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const scrollToHighlighted = useCallback((index: number) => {
    if (index >= 0 && listRef.current) {
      const item = listRef.current.children[index] as HTMLElement;
      item?.scrollIntoView({ block: "start" });
    }
  }, []);

  const handleSelect = useCallback(
    (fullName: string) => {
      onSelectLocation(fullName);
      inputRef.current?.blur();
    },
    [onSelectLocation]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (autoCompleteItem.length === 0) {
        if (e.key === "Escape" && query) {
          e.preventDefault();
          onClear();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            highlightedIndex < autoCompleteItem.length - 1
              ? highlightedIndex + 1
              : 0;
          setHighlightedIndex(nextIndex);
          scrollToHighlighted(nextIndex);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            highlightedIndex > 0
              ? highlightedIndex - 1
              : autoCompleteItem.length - 1;
          setHighlightedIndex(prevIndex);
          scrollToHighlighted(prevIndex);
          break;
        }
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < autoCompleteItem.length
          ) {
            handleSelect(autoCompleteItem[highlightedIndex]);
          } else if (autoCompleteItem.length > 0) {
            handleSelect(autoCompleteItem[0]);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (query) {
            onClear();
          }
          break;
      }
    },
    [
      autoCompleteItem,
      highlightedIndex,
      handleSelect,
      onClear,
      query,
      scrollToHighlighted
    ]
  );

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
          onKeyDown={handleKeyDown}
          placeholder="장소 검색 (e.g. “서울특별시”, “종로구”, “청운동”)"
          className="w-full px-4 py-3 pr-10 bg-white/10 border border-gray-400 rounded-xl placeholder-gray-400 focus:ring-1"
          role="combobox"
          aria-expanded={autoCompleteItem.length > 0}
          aria-haspopup="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent" />
          </div>
        )}
        {query && !isLoading && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="검색 초기화"
            tabIndex={-1}
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

      {autoCompleteItem.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-1 w-full mt-2  border border-gray-400 overflow-hidden max-h-60 overflow-y-auto"
          role="listbox"
        >
          {autoCompleteItem.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <button
                id={`suggestion-${index}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 text-left border-b last:border-b-0 ${
                  index === highlightedIndex
                    ? " text-blue-600 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                {formatDisplayName(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationSearchInput;
