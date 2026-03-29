import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
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
      <Card className="bg-card/50 backdrop-blur-3xl border-white/5 rounded-none p-8 text-center animate-pulse">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <ShoppingBag className="h-10 w-10 text-white/20" />
          </div>
          <p className="text-xl font-black uppercase italic text-white/40 tracking-tighter">Your Feast awaits</p>
          <p className="text-xs text-white/20 mt-2 uppercase tracking-widest">Add some royalty to your bag</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="sticky top-32 bg-card/80 backdrop-blur-3xl border-white/10 rounded-none shadow-2xl overflow-hidden group">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-gold to-primary" />
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-none border border-primary/20">
                <ShoppingBag className="h-5 w-5 text-primary" />
             </div>
             <span className="text-2xl font-black uppercase italic tracking-tighter text-white">
                Your Stomach
             </span>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary rounded-none bg-primary/5 font-black italic">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="max-h-96 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
              {items && items.length > 0 && items.map((item, idx) => (
                <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 group/item"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden skew-x-[-6deg]">
                    <img
                        src={item.image_url || 'placeholder-food.jpg'}
                        alt={item.name}
                        className="h-full w-full object-cover grayscale-[0.5] group-hover/item:grayscale-0 transition-all skew-x-[6deg] scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="text-sm font-black uppercase italic tracking-tighter text-white group-hover/item:text-primary transition-colors line-clamp-1">
                        {item.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-gold italic">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                  {showActions && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-white/20 hover:text-red-500 transition-colors self-center p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-white/40">Subtotal</span>
            <span className="text-white">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-white/40">Imperial Delivery</span>
            <span className={deliveryFee === 0 ? 'text-green-500' : 'text-white'}>
              {deliveryFee === 0 ? 'Complimentary' : `₹${deliveryFee}`}
            </span>
          </div>
          
          <div className="py-4 border-y border-white/5 flex justify-between items-end">
            <span className="text-sm font-black uppercase italic tracking-widest text-gold text-shadow-sm shadow-gold/20">Grand Total</span>
            <span className="text-4xl font-black text-primary italic tracking-tighter leading-none">
              ₹{totalAmount + deliveryFee}
            </span>
          </div>
        </div>

        {showActions && (
          <Button 
            onClick={() => navigate('/checkout')} 
            className="w-full bg-primary hover:bg-orange-600 text-background font-black uppercase italic tracking-tighter rounded-none py-8 skew-x-[-6deg] shadow-[8px_8px_0_rgba(255,153,51,0.2)] group/btn relative overflow-hidden" 
            size="lg"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 skew-x-[6deg] flex items-center justify-center gap-3 text-xl">
                Proceed to Checkout <ArrowRight className="h-6 w-6" />
            </span>
          </Button>
        )}

        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/20 font-bold">
            <ShieldCheck className="h-3 w-3" />
            Secure Checkout Guaranteed
        </div>

        {deliveryFee > 0 && totalAmount < 300 && (
          <div className="bg-primary/5 p-4 border border-primary/10 text-center">
              <p className="text-[10px] text-primary/60 uppercase font-black tracking-widest leading-relaxed">
                Add <span className="text-gold">₹{300 - totalAmount}</span> more to unlock <br/>
                <span className="text-white underline decoration-gold underline-offset-4">Free Imperial Delivery</span>
              </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
