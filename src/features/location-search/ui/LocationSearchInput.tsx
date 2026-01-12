import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { Input, Button, Card } from "@/shared";

function formatDisplayName(fullName: string): string {
  return fullName.replace(/-/g, " ");
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToHighlighted = (index: number) => {
    if (index >= 0 && listRef.current) {
      const item = listRef.current.children[index] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  };

  const handleSelect = (fullName: string) => {
    onSelectLocation(fullName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
    setHighlightedIndex(-1);
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // 컨테이너 내부 요소로 포커스 이동 시 목록 유지
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 중 Enter는 무시
    if (e.key === "Enter" && e.nativeEvent.isComposing) {
      return;
    }

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
        if (isOpen) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else if (query) {
          onClear();
        }
        break;
    }
  };

  const showDropdown = isOpen && autoCompleteItem.length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className ?? ""}`}
      onBlur={handleBlur}
    >
      <Input
        name="location"
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder="장소 검색 (서울특별시, 종로구, 청운동)"
        className="h-12 pr-10 border border-border"
        role="combobox"
        aria-expanded={showDropdown}
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

      {showDropdown && (
        <Card className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto p-0">
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
                  className={`w-full px-4 py-3 text-left border-b border-border last:border-b-0 transition-colors text-gray-900 ${
                    index === highlightedIndex
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-gray-100"
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
