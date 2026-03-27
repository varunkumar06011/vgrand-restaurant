import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const phone = '+919876543210';
    let message = 'Hi, I want to order:\n\n';
    items.forEach(item => {
      message += `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})\n`;
    });
    message += `\nTotal: ₹${totalAmount}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>Your cart is empty</SheetDescription>
          </SheetHeader>
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Start adding delicious items to your cart!
            </p>
            <Button onClick={() => onOpenChange(false)}>Browse Menu</Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length} items)</SheetTitle>
          <SheetDescription>Review your order before checkout</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.image_url || 'placeholder-food.jpg'}
                  alt={item.name}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <h4 className="font-medium text-foreground">{item.name}</h4>
                  <p className="text-sm text-secondary">₹{item.price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-secondary">₹{totalAmount}</span>
          </div>

          <Button onClick={handleCheckout} className="w-full" size="lg">
            Proceed to Checkout
          </Button>

          <Button
            onClick={handleWhatsAppOrder}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Order on WhatsApp
          </Button>

          <Button
            onClick={clearCart}
            variant="ghost"
            className="w-full text-destructive"
            size="sm"
          >
            Clear Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
