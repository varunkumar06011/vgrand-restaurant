import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { createReview } from '@/db/api';
import { toast } from 'sonner';

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !reviewText.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        name: name.trim(),
        rating,
        review_text: reviewText.trim(),
        status: 'approved',
      });

      setShowCoupon(true);
      setName('');
      setRating(5);
      setReviewText('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowCoupon(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!showCoupon ? (
          <>
            <DialogHeader>
              <DialogTitle>Submit Your Review</DialogTitle>
              <DialogDescription>
                Share your experience and get a special coupon code!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          i < rating
                            ? 'fill-secondary text-secondary'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Thank You! 🎉</DialogTitle>
              <DialogDescription>
                Your review has been submitted successfully!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-secondary/20 p-6 text-center">
                <p className="mb-2 text-sm text-muted-foreground">Your Coupon Code:</p>
                <p className="text-2xl font-bold text-secondary">VGRANDREST50</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get ₹50 off on your next order above ₹500
                </p>
              </div>

              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
