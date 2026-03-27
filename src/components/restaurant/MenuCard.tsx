import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Flame } from 'lucide-react';
import type { MenuItem } from '@/types/restaurant';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ ...item, quantity });
    toast.success(`${item.name} added to cart!`);
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url || 'placeholder-food.jpg'}
          alt={item.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
          {item.is_bestseller && (
            <Badge className="bg-secondary text-secondary-foreground">⭐ Bestseller</Badge>
          )}
          {item.is_new && (
            <Badge className="bg-accent text-accent-foreground">✨ New</Badge>
          )}
          {!item.is_veg && (
            <Badge variant="destructive">Non-Veg</Badge>
          )}
        </div>
        {item.spice_level > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {Array.from({ length: item.spice_level }).map((_, i) => (
              <Flame key={i} className="h-4 w-4 fill-destructive text-destructive" />
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">{item.name}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {item.description || 'Delicious and authentic'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-secondary">₹{item.price}</span>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleAddToCart} size="sm">
              Add to Stomach
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
