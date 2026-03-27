import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBestsellerItems } from '@/db/api';
import type { MenuItem } from '@/types/restaurant';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedBiryanis: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadBestsellerItems();
  }, []);

  const loadBestsellerItems = async () => {
    try {
      const data = await getBestsellerItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load bestseller items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({ ...item, quantity: 1 });
    toast.success(`${item.name} added to cart!`);
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
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
          Our Bestsellers
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <Card key={item.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url || 'placeholder-biryani.jpg'}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {item.is_bestseller && (
                  <Badge className="absolute right-2 top-2 bg-secondary text-secondary-foreground">
                    Bestseller
                  </Badge>
                )}
                {!item.is_veg && (
                  <Badge variant="destructive" className="absolute left-2 top-2">
                    Non-Veg
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.name}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-secondary">₹{item.price}</span>
                  <Button onClick={() => handleAddToCart(item)} size="sm">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
