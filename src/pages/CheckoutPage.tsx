import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, ArrowLeft, Info } from 'lucide-react';
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
    return { fee: totalAmount >= 300 ? 0 : 30, distance: null, message: 'Enter address to calculate delivery fee' };
  }, [checkoutData.delivery_address, totalAmount]);

  const deliveryFee = deliveryFeeResult.fee;
  const finalTotal = totalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Add items to your cart to proceed with checkout</p>
          <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!checkoutData.customer_name.trim() || !checkoutData.customer_phone.trim() || !checkoutData.delivery_address.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!/^[0-9]{10}$/.test(checkoutData.customer_phone)) {
        toast.error('Please enter a valid 10-digit phone number');
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
        toast.success('Order placed successfully!');
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
          toast.success('Redirecting to payment...');
        }
      }
    } catch (error: any) {
      console.error('Order placement failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <Button variant="ghost" onClick={() => step === 1 ? navigate('/menu') : setStep(step - 1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Checkout Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            {/* Progress Indicator */}
            <div className="mb-8 flex items-center justify-center gap-4">
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      s <= step ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`h-1 w-16 ${s < step ? 'bg-secondary' : 'bg-muted'}`} />}
                </React.Fragment>
              ))}
            </div>

        {/* Step 1: Cart Review */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-secondary">₹{finalTotal}</span>
                </div>
              </div>

              <Button onClick={handleContinue} className="w-full" size="lg">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Delivery Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={checkoutData.customer_name}
                  onChange={e => setCheckoutData({ ...checkoutData, customer_name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={checkoutData.customer_phone}
                  onChange={e => setCheckoutData({ ...checkoutData, customer_phone: e.target.value })}
                  placeholder="10-digit phone number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutData.customer_email}
                  onChange={e => setCheckoutData({ ...checkoutData, customer_email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  value={checkoutData.delivery_address}
                  onChange={e => setCheckoutData({ ...checkoutData, delivery_address: e.target.value })}
                  placeholder="Enter complete delivery address"
                  required
                />
                {checkoutData.delivery_address.trim() && (
                  <Alert className="mt-3">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {deliveryFeeResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button onClick={handleContinue} className="w-full" size="lg">
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={checkoutData.payment_method}
                onValueChange={(value: 'cod' | 'online') =>
                  setCheckoutData({ ...checkoutData, payment_method: value })
                }
              >
                <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer">
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-muted-foreground">Pay securely via Stripe (Card/UPI)</div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-semibold">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Items ({items.length})</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-secondary">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handlePlaceOrder} className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        )}
          </div>

          {/* Order Summary Sidebar - Takes 1 column */}
          <div className="hidden lg:block">
            <CartSummary showActions={false} deliveryFee={deliveryFee} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
