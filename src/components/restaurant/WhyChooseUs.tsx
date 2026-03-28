import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Flame, Clock, Shield } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'No Extra Charges',
      description: 'Save ₹50 vs Zomato',
      highlight: 'Direct ordering means better prices for you',
    },
    {
      icon: Flame,
      title: 'Authentic Andhra Taste',
      description: 'Traditional recipes passed down generations',
      highlight: 'Made with love and authentic spices',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: '30–35 mins delivery',
      highlight: 'Hot food delivered to your doorstep',
    },
    {
      icon: Shield,
      title: 'Hygienic Cooking',
      description: 'Highest quality standards',
      highlight: 'Clean kitchen, fresh ingredients',
    },
  ];

  return (
    <section className="bg-card py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-5xl">
          Why Choose V Grand Restaurant?
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-background transition-all hover:shadow-2xl hover:-translate-y-2 rounded-[2rem]">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                  <feature.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mb-2 font-medium text-secondary">{feature.description}</p>
                <p className="text-sm text-muted-foreground">{feature.highlight}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Callout */}
        <div className="mt-12 rounded-[2rem] border-2 border-secondary bg-secondary/10 p-10 text-center">
          <p className="text-xl font-bold text-foreground md:text-2xl">
            💰 Order directly and save money! No platform fees, no surge pricing.
          </p>
          <p className="mt-2 text-muted-foreground">
            Support local business and get the best prices on authentic Andhra cuisine.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
