import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ScrollFrameHero from '@/components/restaurant/ScrollFrameHero';
import FeaturedBiryanis from '@/components/restaurant/FeaturedBiryanis';
import WhyChooseUs from '@/components/restaurant/WhyChooseUs';
import ReviewsSection from '@/components/restaurant/ReviewsSection';
import BookingModal from '@/components/restaurant/BookingModal';
import { useState } from 'react';

const HomePage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const handleWhatsApp = () => {
    const phone = '+919876543210';
    const message = 'Hi, I would like to order the Royal Biryani from V Grand';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-background text-foreground scroll-smooth">
      {/* Cinematic Scroll Hero */}
      <ScrollFrameHero />

      {/* Zomato Ticker */}
      <div className="bg-primary/10 border-y border-primary/20 py-4 overflow-hidden whitespace-nowrap relative z-30">
        <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-20 text-[10px] font-bold uppercase tracking-[0.5em] text-primary"
        >
            <span>Top rated on Zomato in Ongole • </span>
            <span>Top rated on Zomato in Ongole • </span>
            <span>Top rated on Zomato in Ongole • </span>
            <span>Top rated on Zomato in Ongole • </span>
            <span>Top rated on Zomato in Ongole • </span>
            <span>Top rated on Zomato in Ongole • </span>
        </motion.div>
      </div>

      {/* Featured Section with staggered reveal */}
      <section className="relative z-20 -mt-20">
        <FeaturedBiryanis />
      </section>


      <WhyChooseUs />
      <ReviewsSection />
      

      {/* Dramatic CTA */}
      <section className="relative py-32 bg-primary">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden select-none">
            <div className="flex whitespace-nowrap text-9xl font-black uppercase italic tracking-tighter text-background">
                Order Now • Order Now • Order Now • Order Now • Order Now
            </div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
              <h2 className="text-5xl md:text-8xl font-bold text-background uppercase tracking-tight leading-none mb-12">
                Ready for the <br/> <span className="underline decoration-black decoration-8 underline-offset-8">Royal Feast.</span>
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-8">
                <Button asChild size="lg" className="bg-background text-primary hover:bg-white hover:text-black shadow-2xl">
                    <Link to="/menu">Explore Menu</Link>
                </Button>
                <Button
                    size="lg"
                    onClick={() => setIsBookingOpen(true)}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary shadow-2xl"
                >
                    Book Function Hall
                </Button>
                <Button
                    size="lg"
                    onClick={handleWhatsApp}
                    className="bg-[#25D366] text-white hover:bg-[#1DA851] shadow-2xl"
                >
                    WhatsApp Order
                </Button>
              </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-black border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="max-w-md">
              <span className="text-4xl font-bold block mb-6 transition-transform hover:scale-105" style={{ color: 'var(--brand-red)' }}>
                V GRAND <span className="text-white">RESTAURANT</span>
              </span>
              <p className="text-white/40 text-sm uppercase tracking-widest font-black leading-relaxed">
                Ongole's premier destination for authentic Andhra Biryani and luxury dining experiences. Served with passion, crafted for royalty.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-12 lg:gap-24">
                <div>
                    <h4 className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">Location</h4>
                    <p className="text-white font-black uppercase italic tracking-tighter text-2xl">Ongole, AP</p>
                </div>
                <div>
                    <h4 className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">Social</h4>
                    <div className="flex gap-6 justify-center md:justify-start">
                        {['IG', 'FB', 'TW'].map(s => (
                            <span key={s} className="text-white/40 hover:text-primary cursor-pointer transition-all font-black italic text-xl hover:scale-110">{s}</span>
                        ))}
                    </div>
                </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 text-center text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
            &copy; 2026 V Grand Restaurant • The Raja of Biryanis
          </div>
        </div>
      </footer>
      <BookingModal open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </div>
  );
};

export default HomePage;
