import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Sparkles } from 'lucide-react';
import type { MenuItem } from '@/types/restaurant';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const { items, addItem, updateQuantity } = useCart();

  // Derive quantity directly from cart — single source of truth
  const cartItem = items.find(i => i.id === item.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  // Premium Fallback URL (Branded Placeholder)
  const fallbackUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=20'; // Stylized food bowl

  const handleAddToCart = () => {
    addItem({ ...item, quantity: 1 });
    toast.success(`${item.name} added to your royal feast!`, {
        icon: <Sparkles className="h-4 w-4 text-primary" />,
        style: {
            background: '#1A1A1A',
            color: '#FF9933',
            border: '1px solid #FF9933'
        }
    });
  };

  const handleIncrement = () => updateQuantity(item.id, cartQty + 1);
  const handleDecrement = () => updateQuantity(item.id, cartQty - 1);

  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative"
    >
        <Card className="group overflow-hidden bg-card border-white/5 hover:border-primary/50 transition-all duration-500 rounded-3xl shadow-2xl">
            <div className="relative h-64 overflow-hidden">
                {/* Image with zoom effect and error handling */}
                <motion.img
                    src={hasImageError ? fallbackUrl : (item.image_url || fallbackUrl)}
                    alt={item.name}
                    onError={() => setHasImageError(true)}
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.8 }}
                    className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                    loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />
                
                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {item.is_bestseller && (
                        <Badge className="bg-primary text-background font-bold uppercase tracking-wide rounded-full text-[10px] px-3">
                            Royal Pick
                        </Badge>
                    )}
                    {item.is_new && (
                        <Badge className="bg-gold text-background font-bold uppercase tracking-wide rounded-full text-[10px] px-3">
                            Fresh
                        </Badge>
                    )}
                    {!item.is_veg ? (
                        <span className="nonveg-icon" title="Non-Vegetarian" />
                    ) : (
                        <span className="veg-icon" title="Vegetarian" />
                    )}
                </div>

            </div>

            <div className="p-6 relative">
                {/* Decorative background text */}
                <div className="absolute right-4 bottom-4 text-4xl font-bold text-white/5 uppercase select-none pointer-events-none">
                    {item.category.split('_').pop()}
                </div>

                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-menu text-2xl font-bold uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                    <div className="text-2xl font-bold text-gold">
                        ₹{item.price}
                    </div>
                </div>

                <p className="mb-8 line-clamp-2 text-sm text-white/60 font-medium tracking-wide">
                    {item.description || 'A masterpiece of authentic Andhra spices and premium ingredients.'}
                </p>

                <div className="flex items-center justify-center gap-4">
                    {cartQty === 0 ? (
                        /* Not in cart — pill fill animation button */
                        <button
                            onClick={handleAddToCart}
                            className="add-to-cart-pill w-full"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        /* In cart — show synced +/- controls */
                        <div className="flex items-center gap-1 bg-white/5 border border-primary/40 rounded-full p-1 w-full justify-between">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary hover:text-background transition-colors rounded-full"
                                onClick={handleDecrement}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-primary">{cartQty}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary hover:text-background transition-colors rounded-full"
                                onClick={handleIncrement}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
        
        {/* Hover glow effect */}
        <AnimatePresence>
            {isHovered && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary/20 blur-3xl -z-10 pointer-events-none"
                />
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default MenuCard;
