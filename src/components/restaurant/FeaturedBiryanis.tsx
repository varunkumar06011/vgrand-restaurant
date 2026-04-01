import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import type { MenuItem } from '@/types/restaurant';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { OptimizedImage } from '@/components/OptimizedImage';

const FeaturedBiryanis: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: cartItems, addItem, updateQuantity } = useCart();

  useEffect(() => {
    loadBestsellerItems();
  }, []);

  const loadBestsellerItems = async () => {
    try {
      if (!supabase) {
        setItems([]);
        return;
      }

      // Home page Signature Dishes section should only show specific signature items
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .in('name', [
          'Mutton Keema Biryani',
          'Special Chicken Biryani',
          'Chicken 65',
          'Apollo Fish'
        ])
        .eq('is_available', true)
        .limit(4);

      if (error || !data) {
        setItems([]);
      } else {
        // Ensure accurate ordering as requested
        const orderedNames = [
          'Mutton Keema Biryani',
          'Special Chicken Biryani',
          'Chicken 65',
          'Apollo Fish'
        ];
        const sortedData = data.sort((a, b) => 
          orderedNames.indexOf(a.name) - orderedNames.indexOf(b.name)
        );
        setItems(sortedData);
      }
    } catch (error) {
      console.error('Failed to load signature items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({ ...item, quantity: 1 });
    toast.success(`${item.name} added to cart!`);
  };

  const getCartQty = (itemId: string) => {
    const found = cartItems.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  if (loading) {
    return (
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
            Our Bestsellers
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full bg-muted" />
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-6 w-3/4 bg-muted" />
                  <Skeleton className="mb-4 h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-10 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl md:text-7xl font-bold uppercase tracking-tight text-white">
          Signature <span className="text-primary underline decoration-white/10">Dishes</span>
        </h2>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {items && items.length > 0 ? (
            items.map(item => (
              <Card key={item.id} className="group overflow-hidden bg-card/40 border-white/5 hover:border-primary/50 transition-all duration-500 rounded-none relative">
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {item.is_bestseller && (
                    <Badge className="absolute right-2 top-2 bg-secondary text-secondary-foreground">
                      Bestseller
                    </Badge>
                  )}
                  <span
                    className={item.is_veg ? 'veg-icon' : 'nonveg-icon'}
                    title={item.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                    style={{ position: 'absolute', left: '10px', top: '10px' }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.name}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xl font-bold text-secondary">₹{item.price}</span>
                    {getCartQty(item.id) === 0 ? (
                      <button onClick={() => handleAddToCart(item)} className="add-to-cart-pill">
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 bg-white/5 border border-primary/40 rounded-full p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary hover:text-background transition-colors rounded-full"
                          onClick={() => updateQuantity(item.id, getCartQty(item.id) - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-7 text-center font-bold text-primary text-sm">{getCartQty(item.id)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary hover:text-background transition-colors rounded-full"
                          onClick={() => updateQuantity(item.id, getCartQty(item.id) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5">
              <p className="text-2xl font-black uppercase italic text-white/20 tracking-tighter">
                No items available
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/menu">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBiryanis;
