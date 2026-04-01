import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const reviewsData = [
  {
    name: "Rahul Naidu",
    rating: 5,
    text: "Had an amazing dining experience here! The biryani was absolutely delicious and full of flavor. The ambiance is very pleasant and perfect for family dinners. Staff were polite and service was quick. Definitely one of the best places I’ve visited recently!"
  },
  {
    name: "Sneha Reddy",
    rating: 5,
    text: "Loved the food and the overall vibe of the restaurant. Everything we ordered was fresh and tasty, especially the starters and biryani. The place is clean and well maintained. Great spot to hang out with friends and family!"
  },
  {
    name: "Arjun Chowdary",
    rating: 5,
    text: "Fantastic experience! The food quality is top-notch and the taste is consistent. The ambiance is cozy and welcoming. Service was smooth and staff were very friendly. Highly recommend trying their biryani and curries."
  },
  {
    name: "Priya Yadav",
    rating: 5,
    text: "Visited with family and had a wonderful time. The food was really good and served hot. The staff made sure everything was comfortable for us. Nice ambiance and overall a great place for family outings. Will definitely visit again!"
  }
];

const ReviewsSection: React.FC = () => {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-white mb-4">
                Guest <span className="text-primary underline decoration-white/10">Reviews</span>
            </h2>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black italic">What our royalty says about us</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
          {reviewsData.map((review, index) => (
            <Card key={index} className="bg-card/40 border-white/5 hover:border-primary/30 transition-all duration-500 rounded-none group relative overflow-hidden">
                {/* Decorative Quote Mark */}
                <div className="absolute -top-4 -right-4 text-9xl font-black text-white/5 italic select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                    “
                </div>
                
                <CardContent className="p-10 relative z-10">
                    <div className="mb-6 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 fill-primary text-primary transition-transform duration-500 group-hover:scale-110`}
                            style={{ transitionDelay: `${i * 50}ms` }}
                        />
                        ))}
                    </div>
                    
                    <p className="mb-8 text-white/70 text-lg leading-relaxed italic font-medium">
                        "{review.text}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-primary/30" />
                        <span className="font-black uppercase italic tracking-widest text-sm text-white transition-colors group-hover:text-primary">
                            {review.name}
                        </span>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
