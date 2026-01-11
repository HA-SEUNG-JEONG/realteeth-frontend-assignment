import { useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Input, Button, Card } from "@/shared";

interface LocationSearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  autoCompleteItem: string[];
  onSelectLocation: (fullName: string) => void;
  onClear: () => void;
  className?: string;
}

function LocationSearchInput({
  query,
  onQueryChange,
  autoCompleteItem,
  onSelectLocation,
  onClear,
  className
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
    <div className={`relative w-full ${className ?? ""}`}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="장소 검색 (서울특별시, 종로구, 청운동)"
        className="h-12 pr-10"
        role="combobox"
        aria-expanded={autoCompleteItem.length > 0}
        aria-haspopup="listbox"
        aria-activedescendant={
          highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
        }
      />
      {query && (
        <Button
          onClick={onClear}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted hover:text-accent-red"
          aria-label="검색 초기화"
          tabIndex={-1}
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      {autoCompleteItem.length > 0 && (
        <Card className="absolute z-10 w-full mt-2 overflow-hidden max-h-60 overflow-y-auto p-0">
          <ul ref={listRef} role="listbox">
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
                  className={`w-full px-4 py-3 text-left border-b border-border last:border-b-0 transition-colors ${
                    index === highlightedIndex
                      ? "bg-primary/20 text-primary font-semibold"
                      : "hover:bg-card-hover"
                  }`}
                >
                  {formatDisplayName(item)}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

export default LocationSearchInput;
