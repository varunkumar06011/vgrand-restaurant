import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const HeroSection: React.FC = () => {
  const handleWhatsApp = () => {
    const phone = '+919876543210';
    const message = 'Hi, I would like to order from V Grand Restaurant';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden bg-card md:min-h-[700px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3e782de9-74f2-46b9-a3c6-d6c518bdd5c7.jpg)',
          filter: 'brightness(0.4)',
        }}
      />

      {/* Steam Animation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
        <div className="steam-animation absolute inset-0 bg-gradient-to-t from-transparent via-secondary/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 text-center md:min-h-[700px]">
        <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
          Raja of Biryanis in Ongole
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-foreground/90 md:text-xl">
          Authentic Andhra flavors. Order directly. No extra charges.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" variant="default" className="text-base md:text-lg">
            <Link to="/menu">Order Now</Link>
          </Button>
          <Button
            onClick={handleWhatsApp}
            size="lg"
            className="bg-[#25D366] text-base text-white hover:bg-[#20BA5A] md:text-lg"
          >
            Order on WhatsApp
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base md:text-lg">
            <Link to="/contact">
              <MapPin className="mr-2 h-5 w-5" />
              View Location
            </Link>
          </Button>
        </div>

        {/* Trust Line */}
        <div className="mt-8 flex flex-col gap-2 text-sm text-foreground/80 md:flex-row md:gap-4 md:text-base">
          <span>⚡ Free delivery within 10km (₹50 beyond 10km)</span>
          <span className="hidden md:inline">•</span>
          <span>🚀 Delivered in 30–35 mins</span>
        </div>

        {/* Social Proof */}
        <div className="mt-4 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary md:text-base">
          ⭐ Top Rated on Zomato in Ongole
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
