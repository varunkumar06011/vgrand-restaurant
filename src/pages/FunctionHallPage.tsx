import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { createBooking } from '@/db/api';
import { toast } from 'sonner';

const FunctionHallPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState<Date>();
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !eventDate || !eventType || !guestCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const count = parseInt(guestCount);
    if (count < 100 || count > 150) {
      toast.error('Guest count must be between 100 and 150');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        event_date: format(eventDate, 'yyyy-MM-dd'),
        event_type: eventType,
        guest_count: count,
        notes: notes.trim() || null,
        status: 'pending',
      });

      setSubmitted(true);
      toast.success('Booking inquiry submitted successfully!');
    } catch (error) {
      console.error('Failed to submit booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
                <CalendarIcon className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Booking Inquiry Received!</h2>
              <p className="mb-6 text-center text-muted-foreground">
                Thank you for your interest in our function hall. We'll contact you within 24 hours to confirm availability and discuss details.
              </p>
              <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground md:text-5xl">
          V Grand Function Hall
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="h-80 overflow-hidden rounded-lg">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_37d5a87b-3a3d-433a-8297-145a55188950.jpg"
                alt="Function Hall Main View"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 overflow-hidden rounded-lg">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_74e25857-4a4f-4849-b0cd-f12ac0ad54bf.jpg"
                  alt="Function Hall Interior"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-32 overflow-hidden rounded-lg">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e1969d65-5557-48e6-8659-8aa6e68f8031.jpg"
                  alt="Function Hall Setup"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-32 overflow-hidden rounded-lg">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_fe5656a8-baf8-4bba-b0c3-0095f3c14a40.jpg"
                  alt="Function Hall Dining"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3">
                  <Users className="mt-1 h-6 w-6 text-secondary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Capacity</h3>
                    <p className="text-sm text-muted-foreground">100–150 guests comfortably</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-6 w-6 text-secondary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="text-sm text-muted-foreground">Ongole, Andhra Pradesh</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Amenities</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Air Conditioned Hall</li>
                    <li>✓ Catering Services Available</li>
                    <li>✓ Ample Parking Space</li>
                    <li>✓ Audio System & Microphone</li>
                    <li>✓ Decorations Allowed</li>
                    <li>✓ Flexible Seating Arrangements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Suitable For</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Birthdays', 'Engagements', 'Corporate Events', 'Family Gatherings', 'Anniversaries'].map(
                      event => (
                        <span
                          key={event}
                          className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary"
                        >
                          {event}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Check Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label>Event Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, 'PPP') : 'Select event date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="family">Family Gathering</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="guestCount">Guest Count (100-150) *</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="100"
                    max="150"
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    placeholder="Number of guests"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special requirements or questions..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Check Availability'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FunctionHallPage;
