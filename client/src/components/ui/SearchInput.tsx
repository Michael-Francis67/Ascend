import React, { forwardRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  debounceDelay?: number;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      onClear,
      containerClassName,
      inputClassName,
      className,
      value: externalValue,
      onChange,
      placeholder = "Search...",
      debounceDelay = 300,
      ...props
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState(externalValue || "");

    useEffect(() => {
      if (externalValue !== undefined) {
        setSearchValue(externalValue);
      }
    }, [externalValue]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (onSearch) {
          onSearch(searchValue as string);
        }
      }, debounceDelay);

      return () => clearTimeout(timer);
    }, [searchValue, debounceDelay, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);
      if (onChange) onChange(e);
    };

    const handleClear = () => {
      setSearchValue("");
      if (onClear) onClear();
      if (onSearch) onSearch("");
    };

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
        <input
          ref={ref}
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 transition-all duration-200",
            "bg-white text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
            inputClassName,
            className,
          )}
          {...props}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
