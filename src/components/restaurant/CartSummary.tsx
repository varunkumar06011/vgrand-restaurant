import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  showActions?: boolean;
  deliveryFee?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showActions = true, deliveryFee: customDeliveryFee }) => {
  const { items, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  // Use custom delivery fee if provided, otherwise calculate default
  const deliveryFee = customDeliveryFee !== undefined ? customDeliveryFee : (totalAmount >= 300 ? 0 : 30);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Your bag is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Your Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image_url || 'placeholder-food.jpg'}
                alt={item.name}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex flex-1 flex-col">
                <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                <p className="text-sm font-semibold text-secondary">₹{item.price * item.quantity}</p>
              </div>
              {showActions && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium text-foreground">
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-secondary">
              ₹{totalAmount + deliveryFee}
            </span>
          </div>
        </div>

        {showActions && (
          <Button onClick={() => navigate('/checkout')} className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        )}

        {deliveryFee > 0 && totalAmount < 300 && (
          <p className="text-center text-xs text-muted-foreground">
            Add ₹{300 - totalAmount} more for free delivery within 10km
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
