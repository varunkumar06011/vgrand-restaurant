import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-background pt-32 px-4">
        <div className="container mx-auto">
          <Skeleton className="mb-8 h-20 w-full bg-white/5 rounded-none" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full bg-white/5 rounded-none" />
                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-full bg-white/5" />
                </div>
                ))}
            </div>
            <Skeleton className="hidden lg:block h-[500px] w-full bg-white/5 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dramatic Hero Header */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-fixed bg-center grayscale opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 text-center px-4">

            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none"
            >
                The Royal <span className="text-primary italic underline decoration-gold/30">Menu</span>
            </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-card/50 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl skew-x-[-2deg]">
             <div className="skew-x-[2deg]">
                <FilterBar onFilterChange={setFilters} />
             </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-12 flex w-full flex-wrap justify-start gap-4 bg-transparent h-auto p-0">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-[4px_4px_0_rgba(255,153,51,0.2)] bg-white/5 text-white/60 hover:text-white px-6 py-3 rounded-none skew-x-[-12deg] transition-all duration-300 font-black uppercase italic tracking-tighter text-sm"
                  >
                    <span className="skew-x-[12deg]">{cat.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                  {categories.map(cat => (
                    <TabsContent key={cat.value} value={cat.value} className="mt-0 focus-visible:outline-none">
                      {filteredItems.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-24 text-center border-2 border-dashed border-white/5"
                        >
                            <p className="text-2xl font-black uppercase italic text-white/20 tracking-tighter">
                                No Royal Delicacies Found
                            </p>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                          {filteredItems.map((item) => (
                            <MenuCard key={item.id} item={item} />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="sticky top-32">
             <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card/30 backdrop-blur-xl border border-white/5 p-1 skew-x-[1deg]"
             >
                <div className="skew-x-[-1deg]">
                    <CartSummary />
                </div>
             </motion.div>
             
             {/* Decorative Element */}
             <div className="mt-8 p-8 border border-primary/20 bg-primary/5 text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="text-gold font-bold uppercase italic tracking-widest text-xs mb-2">Chef's Promise</h4>
                <p className="text-white/40 text-xs leading-relaxed font-medium">
                    "Authenticity is the secret ingredient in every royal dish we serve."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
