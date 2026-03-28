import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sparkles, XCircle, Loader2, ArrowRight, History, Heart, ShieldCheck } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-8">
            <div className="relative inline-block">
                <Loader2 className="h-24 w-24 animate-spin text-primary opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
                </div>
            </div>
            <h2 className="text-4xl font-bold text-white uppercase tracking-tight">Consulting <span className="text-primary">Archives</span></h2>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">Verifying your tribute...</p>
        </div>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-10"
        >
            <div className="h-24 w-24 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto rounded-3xl">
                <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <div className="space-y-4">
                <h2 className="text-5xl font-bold text-white uppercase tracking-tight leading-tight">Order <span className="text-red-500">Failed</span></h2>
                <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold leading-relaxed px-10">
                    {error || 'Your payment could not be verified. Please try again or contact support.'}
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Button 
                    onClick={() => navigate('/checkout')} 
                    className="h-16 shadow-xl shadow-primary/20"
                >
                    Retry Payment
                </Button>
                <Button 
                    onClick={() => navigate('/menu')} 
                    variant="outline"
                    className="border-white/10 text-white/60 hover:text-white h-14"
                >
                    Back to Menu
                </Button>
            </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3e782de9-74f2-46b9-a3c6-d6c518bdd5c7.jpg')] bg-cover bg-center grayscale opacity-5" />
      
      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
        >
          <div className="relative inline-block mb-10">
             <div className="h-24 w-24 bg-primary flex items-center justify-center rounded-full shadow-2xl shadow-primary/20 mx-auto">
                <Sparkles className="h-12 w-12 text-background" />
             </div>
          </div>

          <h2 className="text-6xl md:text-9xl font-bold text-white uppercase tracking-tight mb-4 leading-none">
            Order <span className="text-primary underline decoration-gold/30">Confirmed</span>
          </h2>
          <p className="text-gold/60 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-16">
            Payment verified • Order accepted
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card/40 backdrop-blur-3xl border border-white/5 p-10 rounded-3xl text-left"
            >
                <div className="space-y-6">
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold/60 border-b border-white/5 pb-2">Order Records</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-white/40 uppercase tracking-widest">Order Reference</span>
                            <span className="text-primary tracking-tighter text-xl">#{order?.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-white/40 uppercase tracking-widest">Total Amount</span>
                            <span className="text-white tracking-tighter text-2xl font-bold">₹{order?.total_amount}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-primary/5 backdrop-blur-3xl border border-primary/20 p-10 rounded-3xl text-center flex flex-col justify-center"
            >
                <div className="space-y-3">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest leading-none">Arrival Estimate</p>
                    <p className="text-5xl font-bold text-white tracking-tight">30-35</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Minutes</p>
                </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Button 
                onClick={() => navigate('/my-orders')} 
                variant="outline"
                className="px-12 py-8 border-white/10 text-white hover:bg-white/5"
            >
              <span className="flex items-center gap-3"><History className="h-5 w-5" /> Track History</span>
            </Button>
            <Button 
                onClick={() => navigate('/menu')} 
                className="px-16 py-8 shadow-xl shadow-primary/20"
            >
              <span className="flex items-center gap-2">Order More <ArrowRight className="h-5 w-5" /></span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16 text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-primary/40">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Dining with Honor</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
