import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/restaurant/HeroSection';
import FeaturedBiryanis from '@/components/restaurant/FeaturedBiryanis';
import WhyChooseUs from '@/components/restaurant/WhyChooseUs';
import ReviewsSection from '@/components/restaurant/ReviewsSection';
import FunctionHallPreview from '@/components/restaurant/FunctionHallPreview';

const HomePage: React.FC = () => {
  const handleWhatsApp = () => {
    const phone = '+919876543210';
    const message = 'Hi, I would like to order from V Grand Restaurant';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedBiryanis />
      <WhyChooseUs />
      <ReviewsSection />
      <FunctionHallPreview />

      {/* Repeat CTA Section */}
      <section className="bg-primary py-12 text-center md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Hungry? Order Now and Skip the Queue.
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Get authentic Andhra biryani delivered to your doorstep in 30–35 minutes
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link to="/menu">Order Now</Link>
            </Button>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="bg-[#25D366] text-white hover:bg-[#20BA5A]"
            >
              Order on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 V Grand Restaurant. All rights reserved.</p>
          <p className="mt-2">Raja of Biryanis • Ongole, Andhra Pradesh</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
