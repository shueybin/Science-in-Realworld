import React, { useState, useMemo } from 'react';
import { ChemicalElement, CategoryKey, StateOfMatter } from '../types';
import { ELEMENTS, CATEGORIES } from '../data/elementsData';
import { useLicense } from '../context/LicenseContext';
import { Search, X, Star, Filter, Sparkles } from 'lucide-react';

interface Props {
  onSelectElement: (element: ChemicalElement) => void;
}

export const PeriodicTable: React.FC<Props> = ({ onSelectElement }) => {
  const { currentUser } = useLicense();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryKey | null>(null);
  const [selectedState, setSelectedState] = useState<StateOfMatter | 'all'>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const filteredElements = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ELEMENTS.filter(e => {
      // Category match
      if (selectedCat && e.cat !== selectedCat) return false;

      // State match
      if (selectedState !== 'all' && e.state !== selectedState) return false;

      // Bookmarked filter
      if (onlyBookmarked && (!currentUser?.bookmarkedElements.includes(e.z))) return false;

      // Query match (Symbol, Name, Number, or Real-world usage text!)
      if (q) {
        const matchesSym = e.s.toLowerCase() === q;
        const matchesName = e.n.toLowerCase().includes(q);
        const matchesZ = String(e.z) === q;
        const matchesUse = e.u.toLowerCase().includes(q);
        return matchesSym || matchesName || matchesZ || matchesUse;
      }

      return true;
    });
  }, [searchQuery, selectedCat, selectedState, onlyBookmarked, currentUser]);

  const matchedZSet = useMemo(() => {
    return new Set(filteredElements.map(e => e.z));
  }, [filteredElements]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedCat || selectedState !== 'all' || onlyBookmarked
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCat(null);
    setSelectedState('all');
    setOnlyBookmarked(false);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, symbol (Fe, Au), number (26), or use (battery, phone, star)..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* State of matter pills */}
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
              {(['all', 'solid', 'liquid', 'gas', 'synthetic'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-2.5 py-1.5 rounded-lg capitalize transition ${
                    selectedState === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                onlyBookmarked
                  ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Show only bookmarked elements"
            >
              <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Saved</span>
              {currentUser && currentUser.bookmarkedElements.length > 0 && (
                <span className="text-[10px] px-1 rounded-full bg-amber-400/30">
                  {currentUser.bookmarkedElements.length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition whitespace-nowrap font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Legend Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map(catKey => {
            const cat = CATEGORIES[catKey];
            const isActive = selectedCat === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCat(isActive ? null : catKey)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition border ${
                  isActive
                    ? 'border-slate-800 dark:border-white bg-slate-100 dark:bg-slate-800 font-semibold'
                    : selectedCat
                    ? 'opacity-40 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results counter indicator */}
        {hasActiveFilters && (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>
              Showing <strong className="text-cyan-600 dark:text-cyan-400">{filteredElements.length}</strong> of 118 elements
            </span>
            {filteredElements.length === 0 && (
              <span className="text-rose-500 font-medium">No elements matched your filters.</span>
            )}
          </div>
        )}
      </div>

      {/* Periodic Table Grid Container */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900/80 p-3 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto touch-pan">
        <div className="min-w-[1020px] max-w-[1240px] mx-auto">
          {/* Main 18-column Table Grid */}
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: 'repeat(18, minmax(52px, 1fr))',
              gridAutoRows: 'minmax(60px, 1fr)'
            }}
          >
            {ELEMENTS.map(element => {
              const isMatched = matchedZSet.has(element.z);
              const cat = CATEGORIES[element.cat];
              const isSaved = currentUser?.bookmarkedElements.includes(element.z);

              return (
                <button
                  key={element.z}
                  onClick={() => onSelectElement(element)}
                  style={{
                    gridRow: element.r,
                    gridColumn: element.c,
                    borderTop: `3px solid ${cat?.color || '#3b82f6'}`
                  }}
                  className={`group relative flex flex-col justify-between p-1.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 transition-all duration-150 cursor-pointer overflow-hidden ${
                    isMatched
                      ? 'hover:-translate-y-1 hover:shadow-lg hover:border-cyan-500 hover:z-10 opacity-100'
                      : 'opacity-20 grayscale pointer-events-none'
                  } ${searchQuery && isMatched ? 'ring-2 ring-cyan-500 shadow-md' : ''}`}
                >
                  {/* Top: Atomic Number & Realworld Emoji */}
                  <div className="flex items-start justify-between w-full">
                    <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                      {element.z}
                    </span>
                    <span className="text-xs leading-none" title={element.u}>
                      {element.i}
                    </span>
                  </div>

                  {/* Middle: Big Chemical Symbol */}
                  <div className="my-auto">
                    <div
                      className="font-heading font-bold text-base sm:text-lg leading-tight tracking-tight"
                      style={{ color: cat?.color }}
                    >
                      {element.s}
                    </div>
                    <div className="text-[9px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[54px]">
                      {element.n}
                    </div>
                  </div>

                  {/* Bottom: Bookmarked star or atomic weight */}
                  <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                    <span className="truncate">{element.weight?.split('.')[0] || ''}</span>
                    {isSaved && <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />}
                  </div>
                </button>
              );
            })}

            {/* Lanthanide Placeholder (Row 6, Col 3) */}
            <div
              style={{ gridRow: 6, gridColumn: 3 }}
              className="flex flex-col items-center justify-center p-1 rounded-lg border-2 border-dashed border-pink-400/40 bg-pink-500/5 text-pink-600 dark:text-pink-400 text-center text-[10px] font-mono font-semibold"
            >
              <span>57–71</span>
              <span className="text-[8px] font-sans">La–Lu</span>
            </div>

            {/* Actinide Placeholder (Row 7, Col 3) */}
            <div
              style={{ gridRow: 7, gridColumn: 3 }}
              className="flex flex-col items-center justify-center p-1 rounded-lg border-2 border-dashed border-purple-400/40 bg-purple-500/5 text-purple-600 dark:text-purple-400 text-center text-[10px] font-mono font-semibold"
            >
              <span>89–103</span>
              <span className="text-[8px] font-sans">Ac–Lr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
