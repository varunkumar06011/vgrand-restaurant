import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyStripePayment, getOrderBySessionId } from '@/db/api';
import type { Order } from '@/types/restaurant';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setError('No session ID found');
      setVerifying(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const result = await verifyStripePayment(sessionId!);
      setVerified(result.verified);

      if (result.verified) {
        const orderData = await getOrderBySessionId(sessionId!);
        setOrder(orderData);
      } else {
        setError('Payment not completed');
      }
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setError(err.message || 'Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-16 w-16 animate-spin text-secondary" />
            <h2 className="mb-2 text-2xl font-bold text-foreground">Verifying Payment...</h2>
            <p className="text-center text-muted-foreground">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <XCircle className="mb-4 h-16 w-16 text-destructive" />
            <h2 className="mb-2 text-2xl font-bold text-foreground">Payment Failed</h2>
            <p className="mb-6 text-center text-muted-foreground">
              {error || 'Your payment could not be verified. Please try again.'}
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/menu')} variant="outline">
                Back to Menu
              </Button>
              <Button onClick={() => navigate('/checkout')}>Retry Checkout</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-secondary" />
          </div>
          <CardTitle className="text-3xl">Payment Successful! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">Order ID</p>
            <p className="text-lg font-mono font-semibold text-foreground">
              {order?.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer Name</span>
                <span className="font-medium text-foreground">{order?.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-foreground">{order?.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Address</span>
                <span className="font-medium text-foreground">{order?.delivery_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold text-secondary">₹{order?.total_amount}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-secondary bg-secondary/10 p-4">
            <p className="text-center font-medium text-foreground">
              🚀 Your order will be delivered in 30–35 minutes
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              We'll call you shortly to confirm your order
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
              Back to Home
            </Button>
            <Button onClick={() => navigate('/menu')} className="flex-1">
              Order Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
