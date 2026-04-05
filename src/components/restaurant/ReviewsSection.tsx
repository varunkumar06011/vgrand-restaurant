import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reviewsData = [
  {
    name: "Teja Pasupu Reddy",
    rating: 5,
    text: "Today it was our first visit on my friend's suggestion stepping to dine in v grand family restaurant it was an amazing experience to us starters and biryanis we ordered are hot and delicious.service and hospitality is very impressive.our chicken enjoyed a lot with funny ambience with hanging monkeys. over-all our whole family are fully satisfied with tasty food and good service. Very soon you can expect our visit once again 👍"
  },
  {
    name: "Sam son",
    rating: 5,
    text: "Our first visit to v Grand family restaurant is amazing experience. Nonveg and veg starters are very tasty. Mutton fry piece biryani, chicken dum biryani and boneless biryani is very good well cooked and served hot.we are fully satisfied with the food and service with good receiving. Ambience is very funny with hanging monkeys and good traditional paintings.suggeted good family restaurant in Ongole to done with family and friends. You can expect our next visit very soon ."
  },
  {
    name: "Pathi Prasad",
    rating: 5,
    text: "Today was an amazing experience tasting chicken hot and sour soup, panner manchuria, special chicken Tikka, and Butter nan with casewnut curry and Ajanta chicken biriyani. All the items we ordered are delicious, served hot in patron.our whole family are fully satisfied. You can expect our next visit very soon."
  },
  {
    name: "Haribabu Dasari",
    rating: 5,
    text: "Our staff birthday celebration was gone very interesting to remember with tasty starters and delicious biryani ,we are all fully satisfied with good service and reception given."
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
        <div className="mt-16 text-center">
            <Button 
                asChild
                className="bg-primary text-black hover:bg-white transition-all duration-300 rounded-none h-14 px-8 font-black uppercase italic tracking-widest group"
            >
                <a 
                    href="https://www.google.com/maps/place/V+Grand+Family+Restaurant/@15.5136422,80.0445997,17z/data=!4m8!3m7!1s0x3a4b01a96f9d5b31:0x2fc60717d054e9c3!8m2!3d15.513637!4d80.0471746!9m1!1b1!16s%2Fg%2F11gdd9zx6p?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    View All Reviews
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
