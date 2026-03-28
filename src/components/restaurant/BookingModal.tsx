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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    guests: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.guests) {
      toast.error('The Royal Scribes require all details.');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Your Royal Inquiry has been sent! Our representative will contact you shortly.');
      setSubmitting(false);
      onOpenChange(false);
      setFormData({ name: '', phone: '', date: '', guests: '' });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary">Book Function Hall</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Host your royal celebrations with us. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="bg-background border-border rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Contact Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="10-digit mobile number"
              className="bg-background border-border rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Event Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="bg-background border-border rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-sm font-medium">No. of Guests</Label>
              <Input
                id="guests"
                type="number"
                value={formData.guests}
                onChange={e => setFormData({ ...formData, guests: e.target.value })}
                placeholder="Approx count"
                className="bg-background border-border rounded-xl"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-6 rounded-full shadow-lg hover:scale-[1.02] transition-transform" 
            disabled={submitting}
          >
            {submitting ? 'Authenticating Request...' : 'Send Inquiry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
