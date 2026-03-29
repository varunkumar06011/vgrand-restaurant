import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, ArrowLeft, Info, Landmark, CreditCard, Sparkles, MapPin, Phone, User, Mail, ShoppingBag, ShieldCheck, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { createStripeCheckout, createOrder } from '@/db/api';
import { toast } from 'sonner';
import type { CheckoutData } from '@/types/restaurant';
import CartSummary from '@/components/restaurant/CartSummary';
import { calculateDeliveryFee } from '@/lib/delivery';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    payment_method: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);

  // Calculate delivery fee based on address
  const deliveryFeeResult = useMemo(() => {
    if (checkoutData.delivery_address.trim()) {
      return calculateDeliveryFee(checkoutData.delivery_address, totalAmount);
    }
    return { fee: totalAmount >= 300 ? 0 : 30, distance: null, message: 'Enter your palace address to calculate imperial delivery' };
  }, [checkoutData.delivery_address, totalAmount]);

  const deliveryFee = deliveryFeeResult.fee;
  const finalTotal = totalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="text-center max-w-lg">
          <div className="h-32 w-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10">
            <ShoppingBag className="h-16 w-16 text-white/10" />
          </div>
          <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-4">Your Bag is Empty</h2>
          <p className="text-white/40 mb-10 uppercase tracking-widest text-xs font-bold font-medium tracking-wide">The royal kitchen awaits your command. Add some delicacies to begin your feast.</p>
          <Button onClick={() => navigate('/menu')} className="px-12 py-8 shadow-xl shadow-primary/20">
            Browse Royal Menu
          </Button>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!checkoutData.customer_name.trim() || !checkoutData.customer_phone.trim() || !checkoutData.delivery_address.trim()) {
        toast.error('The Royal Scribes require all mandatory details.');
        return;
      }
      if (!/^[0-9]{10}$/.test(checkoutData.customer_phone)) {
        toast.error('A valid 10-digit communication line is required.');
        return;
      }
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      if (checkoutData.payment_method === 'cod') {
        // Create COD order
        await createOrder({
          customer_name: checkoutData.customer_name.trim(),
          customer_phone: checkoutData.customer_phone.trim(),
          customer_email: checkoutData.customer_email?.trim() || null,
          delivery_address: checkoutData.delivery_address.trim(),
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
          })),
          total_amount: finalTotal,
          currency: 'inr',
          payment_method: 'cod',
          status: 'pending',
        });

        clearCart();
        toast.success('Your Royal Feast has been ordered!', {
            icon: <Sparkles className="h-4 w-4 text-primary" />,
            style: { background: '#1A1A1A', color: '#FF9933', border: '1px solid #FF9933' }
        });
        navigate('/order-success');
      } else {
        // Create Stripe checkout
        const result = await createStripeCheckout({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url || undefined,
          })),
          customer_name: checkoutData.customer_name.trim(),
          customer_phone: checkoutData.customer_phone.trim(),
          customer_email: checkoutData.customer_email?.trim(),
          delivery_address: checkoutData.delivery_address.trim(),
        });

        if (result.url) {
          window.open(result.url, '_blank');
          toast.success('Escorting you to the payment gateway...');
        }
      }
    } catch (error: any) {
      console.error('Order placement failed:', error);
      toast.error(error.message || 'The royal kitchen encountered an error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsMeta = [
    { title: 'Review Bag', sub: 'The selection for your feast' },
    { title: 'Delivery', sub: 'Where shall we serve you?' },
    { title: 'Payment', sub: 'Finalizing the tribute' }
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
        {/* Cinematic Header */}
        <div className="relative h-[40vh] flex items-center justify-center overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3e782de9-74f2-46b9-a3c6-d6c518bdd5c7.jpg')] bg-cover bg-center grayscale opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block px-4 py-1 border border-gold/30 text-gold text-xs uppercase tracking-[0.4em] font-black italic mb-6"
                >
                    Finalizing Protocol
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tight leading-tight"
                >
                    Checkout <span className="text-primary underline decoration-gold/30">Secure</span>
                </motion.h1>
            </div>
        </div>

        <div className="container mx-auto max-w-7xl px-6 -mt-10 relative z-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
                {/* Main Checkout Flow */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Simplified Progress Line */}
                    <div className="flex justify-between items-center bg-card/50 backdrop-blur-3xl border border-white/10 p-8 rounded-[2rem] shadow-xl">
                        {stepsMeta.map((s, idx) => (
                            <React.Fragment key={idx}>
                                <div className={`flex flex-col items-center gap-2 skew-x-[2deg] transition-all duration-500 ${step >= idx + 1 ? 'opacity-100' : 'opacity-20'}`}>
                                    <div className={`h-10 w-10 flex items-center justify-center font-bold text-lg rounded-full ${step === idx + 1 ? 'bg-primary text-background' : 'bg-white/5 text-white'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold uppercase tracking-tight text-white">{s.title}</p>
                                    </div>
                                </div>
                                {idx < 2 && <div className={`h-[1px] flex-1 mx-4 ${step > idx + 1 ? 'bg-primary' : 'bg-white/5'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Step 1: Cart Review */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-8 border-l-8 border-primary pl-6 leading-tight">Review Your Imperial Bag</h2>
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-6 bg-card/30 backdrop-blur-3xl border border-white/5 p-6 group transition-all hover:border-primary/30 rounded-3xl">
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                                                    <img
                                                        src={item.image_url || 'placeholder-food.jpg'}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover scale-110"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-center">
                                                    <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h4>
                                                    <div className="flex items-center gap-6">
                                                        <p className="text-sm font-black text-gold italic">₹{item.price}</p>
                                                        <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/10 rounded-full">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-primary hover:text-background transition-colors rounded-full"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-8 text-center font-bold text-primary">{item.quantity}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-primary hover:text-background transition-colors skew-x-[12deg] rounded-none"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center items-end gap-3">
                                                    <p className="text-2xl font-black text-white italic">₹{item.price * item.quantity}</p>
                                                    <button onClick={() => removeItem(item.id)} className="text-white/10 hover:text-red-500 transition-colors">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-8">
                                        <Button onClick={handleContinue} className="px-16 py-10 text-2xl shadow-xl shadow-primary/20">
                                            <span className="flex items-center gap-3">Continue <ArrowLeft className="h-8 w-8 rotate-180" /></span>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Delivery Details */}
                            {step === 2 && (
                                <div className="space-y-10">
                                    <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-8 border-l-8 border-primary pl-6 leading-tight">Service Protocol</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Label className="text-xs uppercase tracking-[0.3em] font-black text-gold/60">King/Queen Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                                <Input
                                                    value={checkoutData.customer_name}
                                                    onChange={e => setCheckoutData({ ...checkoutData, customer_name: e.target.value })}
                                                    className="bg-white/5 border-white/10 rounded-2xl h-16 pl-14 text-lg font-bold tracking-tight focus:border-primary transition-all"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-xs uppercase tracking-[0.3em] font-black text-gold/60">Can I get your number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                                <Input
                                                    type="tel"
                                                    value={checkoutData.customer_phone}
                                                    onChange={e => setCheckoutData({ ...checkoutData, customer_phone: e.target.value })}
                                                    className="bg-white/5 border-white/10 rounded-2xl h-16 pl-14 text-lg font-bold tracking-tight focus:border-primary transition-all"
                                                    placeholder="10-digit number"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4 md:col-span-2">
                                            <Label className="text-xs uppercase tracking-[0.3em] font-black text-gold/60">Your Email (Optional)</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                                <Input
                                                    type="email"
                                                    value={checkoutData.customer_email}
                                                    onChange={e => setCheckoutData({ ...checkoutData, customer_email: e.target.value })}
                                                    className="bg-white/5 border-white/10 rounded-2xl h-16 pl-14 text-lg font-bold tracking-tight focus:border-primary transition-all"
                                                    placeholder="your@royal.email"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4 md:col-span-2">
                                            <Label className="text-xs uppercase tracking-[0.3em] font-black text-gold/60">Where can I meet you with order</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                                <Input
                                                    value={checkoutData.delivery_address}
                                                    onChange={e => setCheckoutData({ ...checkoutData, delivery_address: e.target.value })}
                                                    className="bg-white/5 border-white/10 rounded-2xl h-16 pl-14 text-lg font-bold tracking-tight focus:border-primary transition-all"
                                                    placeholder="Enter complete address"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 mt-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary italic">
                                                    <Info className="h-3 w-3" />
                                                    <span>Free delivery within 10 kms</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold italic">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Delivered in 30–35 mins</span>
                                                </div>
                                            </div>
                                            {checkoutData.delivery_address.trim() && (
                                                <Alert className="bg-primary/5 border-primary/20 rounded-none mt-6">
                                                    <Info className="h-5 w-5 text-primary" />
                                                    <AlertDescription className="text-xs font-black uppercase tracking-widest text-white/60 ml-3">
                                                        {deliveryFeeResult.message}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-8">
                                        <Button variant="ghost" onClick={() => setStep(1)} className="text-white/40 hover:text-white uppercase tracking-widest font-black italic">Go Back</Button>
                                        <Button onClick={handleContinue} className="px-16 py-10 text-2xl shadow-xl shadow-primary/20">
                                            <span className="flex items-center gap-3">Continue <ArrowLeft className="h-8 w-8 rotate-180" /></span>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <div className="space-y-10">
                                    <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-8 border-l-8 border-primary pl-6 leading-tight">Final Tribute</h2>
                                    <RadioGroup
                                        value={checkoutData.payment_method}
                                        onValueChange={(value: 'cod' | 'online') =>
                                        setCheckoutData({ ...checkoutData, payment_method: value })
                                        }
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        <div className={`relative flex items-center justify-between p-8 border cursor-pointer transition-all rounded-3xl ${checkoutData.payment_method === 'cod' ? 'bg-primary border-primary shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`} onClick={() => setCheckoutData({...checkoutData, payment_method: 'cod'})}>
                                            <div className="flex items-center gap-4">
                                                <Landmark className={`h-8 w-8 ${checkoutData.payment_method === 'cod' ? 'text-background' : 'text-primary'}`} />
                                                <div>
                                                    <p className={`text-xl font-bold uppercase tracking-tight ${checkoutData.payment_method === 'cod' ? 'text-background' : 'text-white'}`}>Cash on Delivery (COD)</p>
                                                    <p className={`text-[10px] uppercase font-bold tracking-widest ${checkoutData.payment_method === 'cod' ? 'text-background/60' : 'text-white/40'}`}>Pay when feast is served</p>
                                                </div>
                                            </div>
                                            <RadioGroupItem value="cod" id="cod" className="sr-only" />
                                        </div>

                                        <div className={`relative flex items-center justify-between p-8 border cursor-pointer transition-all rounded-3xl ${checkoutData.payment_method === 'online' ? 'bg-primary border-primary shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`} onClick={() => setCheckoutData({...checkoutData, payment_method: 'online'})}>
                                            <div className="flex items-center gap-4">
                                                <CreditCard className={`h-8 w-8 ${checkoutData.payment_method === 'online' ? 'text-background' : 'text-primary'}`} />
                                                <div>
                                                    <p className={`text-xl font-bold uppercase tracking-tight ${checkoutData.payment_method === 'online' ? 'text-background' : 'text-white'}`}>UPI Payment</p>
                                                    <p className={`text-[10px] uppercase font-bold tracking-widest ${checkoutData.payment_method === 'online' ? 'text-background/60' : 'text-white/40'}`}>Pay securely via UPI / Card</p>
                                                </div>
                                            </div>
                                            <RadioGroupItem value="online" id="online" className="sr-only" />
                                        </div>
                                    </RadioGroup>

                                    <div className="bg-white/5 border border-white/5 p-10 rounded-[2rem] shadow-2xl">
                                        <div className="skew-x-[2deg] space-y-4">
                                            <h4 className="text-xl font-bold uppercase tracking-tight text-gold mb-6">Final Calculation</h4>
                                            <div className="flex justify-between items-center text-xs uppercase tracking-widest font-black text-white/40 italic">
                                                <span>Items Total</span>
                                                <span className="text-white">₹{totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs uppercase tracking-widest font-black text-white/40 italic">
                                                <span>Imperial Delivery</span>
                                                <span className={deliveryFee === 0 ? 'text-green-500' : 'text-white'}>
                                                    {deliveryFee === 0 ? 'Complimentary' : `₹${deliveryFee}`}
                                                </span>
                                            </div>
                                            <div className="h-[1px] bg-white/5 my-4" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-2xl font-bold uppercase tracking-tight text-white">Grand Tribute</span>
                                                <span className="text-5xl font-bold text-primary tracking-tight leading-none">₹{finalTotal}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-8">
                                        <Button variant="ghost" onClick={() => setStep(2)} className="text-white/40 hover:text-white uppercase tracking-widest font-black italic">Go Back</Button>
                                        <Button 
                                            onClick={handlePlaceOrder} 
                                            disabled={submitting}
                                            className="px-20 py-12 text-3xl shadow-2xl shadow-primary/20"
                                        >
                                            <span className="flex items-center gap-4">
                                                {submitting ? 'Finalizing...' : 'Place Order'} <Sparkles className="h-8 w-8" />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Sidebar Bag Summary (Optional but helpful) */}
                <div className="hidden lg:block sticky top-32">
                    <CartSummary showActions={false} deliveryFee={deliveryFee} />
                    
                    {/* Secure Order Badge */}
                    <div className="mt-8 p-8 border border-white/10 bg-white/5 text-center rounded-[2rem] shadow-xl">
                        <div>
                            <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
                            <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-2">Imperial Security</h4>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                                Your command is encrypted and <br/> transmitted via secure royal lines.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CheckoutPage;
