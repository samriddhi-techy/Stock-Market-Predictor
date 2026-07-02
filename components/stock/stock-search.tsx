"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_STOCKS, POPULAR_STOCKS, APP_CONFIG } from '@/lib/constants';
import { useDebounce } from '@/hooks/use-debounce';

interface StockSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (symbol: string) => void;
  recentSearches?: string[];
  className?: string;
  placeholder?: string;
}

export function StockSearch({
  value,
  onChange,
  onSelect,
  recentSearches = [],
  className,
  placeholder = 'Search stocks by symbol or name...',
}: StockSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(value, APP_CONFIG.SEARCH_DEBOUNCE_MS);

  // Filter results based on debounced query
  const results = debouncedQuery.length >= 1
    ? MOCK_STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const showRecent = !debouncedQuery && recentSearches.length > 0;
  const showPopular = !debouncedQuery && !showRecent;

  const allItems = debouncedQuery
    ? results.map((s) => s.symbol)
    : showRecent
    ? recentSearches
    : POPULAR_STOCKS;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && allItems[activeIndex]) {
            handleSelect(allItems[activeIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setActiveIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, allItems, activeIndex]
  );

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    onChange(symbol);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const stockMap = Object.fromEntries(MOCK_STOCKS.map((s) => [s.symbol, s]));

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="stock-search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `stock-option-${activeIndex}` : undefined}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={20}
          className={cn(
            'w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700',
            'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-all duration-150'
          )}
        />
        {value && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && allItems.length > 0 && (
        <ul
          ref={listRef}
          id="stock-search-listbox"
          role="listbox"
          aria-label="Stock search results"
          className={cn(
            'absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-slate-200 dark:border-slate-700',
            'bg-white dark:bg-slate-800 shadow-xl overflow-hidden max-h-72 overflow-y-auto'
          )}
        >
          {/* Section header */}
          <li
            className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5"
            aria-hidden="true"
          >
            {debouncedQuery ? (
              <><Search className="w-3 h-3" /> Results</>
            ) : showRecent ? (
              <><Clock className="w-3 h-3" /> Recent Searches</>
            ) : (
              <><TrendingUp className="w-3 h-3" /> Popular Stocks</>
            )}
          </li>

          {allItems.map((symbol, index) => {
            const stock = stockMap[symbol];
            if (!stock) return null;
            const isGaining = stock.change >= 0;

            return (
              <li
                key={symbol}
                id={`stock-option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors',
                  activeIndex === index
                    ? 'bg-blue-50 dark:bg-blue-950'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                )}
                onClick={() => handleSelect(symbol)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{symbol[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{symbol}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{stock.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={cn('text-xs', isGaining ? 'text-emerald-600' : 'text-red-600')}>
                      {isGaining ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                </div>
              </li>
            );
          })}

          {debouncedQuery && results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              No stocks found for &ldquo;{debouncedQuery}&rdquo;
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
