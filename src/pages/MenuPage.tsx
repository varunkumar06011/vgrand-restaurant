import React, { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import FilterBar, { type FilterState } from '@/components/restaurant/FilterBar';
import MenuCard from '@/components/restaurant/MenuCard';
import CartSummary from '@/components/restaurant/CartSummary';
import { getMenuItems } from '@/db/api';
import type { MenuItem, MenuCategory } from '@/types/restaurant';

const MenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    isVeg: null,
    category: null,
    sortBy: null,
  });
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories: { value: string; label: string; key: MenuCategory | 'all' }[] = [
    { value: 'all', label: 'All Items', key: 'all' },
    { value: 'biryani', label: 'Biryani', key: 'biryani' },
    { value: 'veg_starters', label: 'Veg Starters', key: 'veg_starters' },
    { value: 'non_veg_starters', label: 'Non-Veg Starters', key: 'non_veg_starters' },
    { value: 'veg_main_course', label: 'Veg Main Course', key: 'veg_main_course' },
    { value: 'non_veg_main_course', label: 'Non-Veg Main Course', key: 'non_veg_main_course' },
    { value: 'rice_noodles', label: 'Rice & Noodles', key: 'rice_noodles' },
    { value: 'snacks', label: 'Snacks', key: 'snacks' },
    { value: 'desserts', label: 'Desserts', key: 'desserts' },
  ];

  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    let result = [...items];

    // Filter by active tab
    if (activeTab !== 'all') {
      result = result.filter(item => item.category === activeTab);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by veg/non-veg
    if (filters.isVeg !== null) {
      result = result.filter(item => item.is_veg === filters.isVeg);
    }

    // Sort by price
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [items, activeTab, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="mb-8 h-12 w-64 bg-muted" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full bg-muted" />
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-10 w-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground md:text-5xl">
          Our Menu
        </h1>

        <FilterBar onFilterChange={setFilters} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Menu Items - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-2 bg-transparent">
                {categories.map(cat => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map(cat => (
                <TabsContent key={cat.value} value={cat.value}>
                  {filteredItems.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-lg text-muted-foreground">
                        No items found. Try a different search or filter.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {filteredItems.map(item => (
                        <MenuCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Cart Summary - Takes 1 column on large screens, hidden on mobile */}
          <div className="hidden lg:block">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
