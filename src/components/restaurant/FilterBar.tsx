import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export interface FilterState {
  search: string;
  isVeg: boolean | null;
  category: string | null;
  sortBy: 'price_asc' | 'price_desc' | null;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [isVeg, setIsVeg] = useState<boolean | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      isVeg,
      category,
      sortBy,
    });
  }, [debouncedSearch, isVeg, category, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setIsVeg(null);
    setCategory(null);
    setSortBy(null);
  };

  const hasActiveFilters = search || isVeg !== null || category || sortBy;

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:top-20">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isVeg === true ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsVeg(isVeg === true ? null : true)}
          >
            🥗 Veg
          </Button>
          <Button
            variant={isVeg === false ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsVeg(isVeg === false ? null : false)}
          >
            🍖 Non-Veg
          </Button>
          <Button
            variant={sortBy === 'price_asc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(sortBy === 'price_asc' ? null : 'price_asc')}
          >
            Price: Low → High
          </Button>
          <Button
            variant={sortBy === 'price_desc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(sortBy === 'price_desc' ? null : 'price_desc')}
          >
            Price: High → Low
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
