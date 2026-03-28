import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sparkles, History, ArrowRight, Heart } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3e782de9-74f2-46b9-a3c6-d6c518bdd5c7.jpg')] bg-cover bg-center grayscale opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-20" />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
        >
          <div className="relative inline-block mb-10">
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full scale-125"
             />
             <div className="h-32 w-32 bg-primary flex items-center justify-center rounded-full shadow-2xl shadow-primary/20">
                <Sparkles className="h-16 w-16 text-background" />
             </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tight mb-4 leading-tight">
                Order <span className="text-primary underline decoration-gold/30">Confirmed</span>
            </h2>
            <p className="text-gold/60 uppercase tracking-[0.4em] text-xs font-bold mb-12">
                Your order has been recorded
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-card/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[2rem] mb-12 shadow-2xl"
          >
            <div className="space-y-4">
                <p className="text-white/60 text-sm uppercase font-bold tracking-widest leading-relaxed">
                    "Our chefs are now preparing your delicacies with the utmost precision. <br/>A courier will be dispatched shortly."
                </p>
                <div className="h-[1px] bg-white/5 w-1/4 mx-auto my-6" />
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Heart className="h-4 w-4 fill-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Est. Service Time: 30-35 Minutes</span>
                </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Button 
                onClick={() => navigate('/my-orders')} 
                variant="outline"
                className="px-10 py-8 border-white/10 text-white hover:bg-white/5"
            >
              <span className="flex items-center gap-3"><History className="h-5 w-5" /> Track Order</span>
            </Button>
            <Button 
                onClick={() => navigate('/menu')} 
                className="px-12 py-8 shadow-xl shadow-primary/20 group"
            >
              <span className="flex items-center gap-3">Order Again <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" /></span>
            </Button>
            <Button 
                onClick={() => navigate('/')} 
                variant="ghost"
                className="text-white/40 hover:text-white px-10 py-8"
            >
              <span>Return Home</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
