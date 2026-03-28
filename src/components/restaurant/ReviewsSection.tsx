import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { getApprovedReviews } from '@/db/api';
import type { Review } from '@/types/restaurant';
import ReviewModal from './ReviewModal';
import { Skeleton } from '@/components/ui/skeleton';

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getApprovedReviews();
      setReviews((data || []).slice(0, 6));
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mb-4 h-6 w-full bg-muted" />
                  <Skeleton className="mb-2 h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews && reviews.length > 0 ? (
              reviews.map(review => (
                <Card key={review.id} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? 'fill-secondary text-secondary'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-foreground">{review.review_text}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium">{review.name}</span>
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => setIsModalOpen(true)} size="lg" variant="outline">
              Submit a Review & Get a Coupon
            </Button>
          </div>
        </div>
      </section>

      <ReviewModal open={isModalOpen} onOpenChange={setIsModalOpen} onSuccess={loadReviews} />
    </>
  );
};

export default ReviewsSection;
