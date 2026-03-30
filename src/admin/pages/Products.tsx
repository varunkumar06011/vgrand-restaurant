import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { 
  Search, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types/restaurant';

const Products: React.FC = () => {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error(`Error fetching products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_available: !currentStatus } : p));
      toast.success(`Product ${!currentStatus ? 'is now In Stock' : 'is now Out of Stock'}`);
    } catch (error: any) {
      toast.error(`Failed to update availability: ${error.message}`);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-6 animate-in fade-in transition-all duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Catalog</h1>
          <p className="text-sm text-white/40">Manage menu availability and stock</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-xl font-bold text-sm hover:scale-105 transition-transform">
          <Plus size={18} />
          New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/40 italic">
            No products found matching your search.
          </div>
        ) : filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className={cn(
              "group relative bg-[#1A1A1A] border rounded-2xl p-4 transition-all duration-300 hover:border-[#D4AF37]/30",
              product.is_available ? "border-white/5" : "border-red-500/20 opacity-70"
            )}
          >
            {!product.is_available && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle size={10} />
                  OUT OF STOCK
                </span>
              </div>
            )}
            
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-white/5 mb-4 relative">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/10 text-xs">No Image</div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">{product.category.replace('_', ' ')}</p>
              <h3 className="font-bold text-sm truncate">{product.name}</h3>
              <p className="font-bold text-[#D4AF37]">₹{product.price}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  product.is_available ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                )} />
                <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
                  {product.is_available ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <button 
                onClick={() => toggleAvailability(product.id, product.is_available)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all",
                  product.is_available 
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" 
                    : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                )}
              >
                {product.is_available ? 'MARK UNAVAILABLE' : 'MARK AVAILABLE'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
