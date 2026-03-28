import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { CalendarIcon, Users, MapPin, Sparkles, Star, Gem, Crown, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      toast.error('The Scribes require all mandatory fields to be filled.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit communication line.');
      return;
    }

    const count = parseInt(guestCount);
    if (count < 100 || count > 150) {
      toast.error('The Royal Hall accommodates between 100 and 150 distinguished guests.');
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
      toast.success('Your imperial inquiry has been dispatched to the Grand Vizier.', {
          icon: <Sparkles className="h-4 w-4 text-primary" />,
          style: { background: '#1A1A1A', color: '#FF9933', border: '1px solid #FF9933' }
      });
    } catch (error) {
      console.error('Failed to submit booking:', error);
      toast.error('The messenger failed to reach the palace. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_37d5a87b-3a3d-433a-8297-145a55188950.jpg')] bg-cover bg-center grayscale opacity-10" />
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-2xl text-center"
        >
            <Card className="bg-card/40 backdrop-blur-3xl border border-primary/20 p-16 rounded-none skew-x-[-2deg]">
                <div className="skew-x-[2deg] flex flex-col items-center">
                    <div className="h-24 w-24 bg-primary flex items-center justify-center rounded-none skew-x-[-12deg] mb-10 shadow-[10px_10px_0_rgba(255,153,51,0.2)]">
                        <CheckCircle2 className="h-12 w-12 text-background skew-x-[12deg]" />
                    </div>
                    <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Inquiry <span className="text-primary underline decoration-gold/30">Recorded</span></h2>
                    <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black italic mb-12 max-w-md">
                        Our royal coordinators will consult the scrolls and reach out within 24 royal hours to confirm your banquet.
                    </p>
                    <Button 
                        onClick={() => window.location.href = '/'}
                        className="bg-primary hover:bg-orange-600 text-background font-black uppercase italic tracking-tighter rounded-none px-12 py-8 skew-x-[-12deg]"
                    >
                        <span className="skew-x-[12deg]">Return to Kingdom</span>
                    </Button>
                </div>
            </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* Cinematic Header */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_37d5a87b-3a3d-433a-8297-145a55188950.jpg')] bg-cover bg-center grayscale opacity-20 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-1 border border-primary text-primary text-xs uppercase tracking-[0.5em] font-black italic mb-8"
            >
                The Royal Venue
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none"
            >
                Grand <span className="text-gold italic underline decoration-primary/20">Banquet</span>
            </motion.h1>
            <p className="mt-6 text-white/40 uppercase tracking-[0.4em] text-xs font-black italic">A stage for your most distinguished celebrations</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Gallery & Features (3 columns) */}
          <div className="lg:col-span-3 space-y-12">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div className="aspect-video overflow-hidden border border-white/10 skew-x-[-2deg] group relative">
                    <img
                        src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_37d5a87b-3a3d-433a-8297-145a55188950.jpg"
                        alt="Function Hall Main View"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                        <div className="skew-x-[2deg]">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Imperial Grandeur</h3>
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1 italic">Main Hall Assembly</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                    {[
                        "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_74e25857-4a4f-4849-b0cd-f12ac0ad54bf.jpg",
                        "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e1969d65-5557-48e6-8659-8aa6e68f8031.jpg",
                        "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_fe5656a8-baf8-4bba-b0c3-0095f3c14a40.jpg"
                    ].map((src, i) => (
                        <div key={i} className="h-40 overflow-hidden border border-white/5 skew-x-[-2deg] group">
                            <img src={src} alt="Hall setups" className="h-full w-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500 scale-105 group-hover:scale-100" />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Features Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-card/40 backdrop-blur-3xl border-white/5 rounded-none p-12 skew-x-[2deg] shadow-2xl">
                    <div className="skew-x-[-2deg] grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Crown className="h-6 w-6 text-gold" />
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Hall Logistics</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 border-l border-primary/20 pl-6">
                                        <Users className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Assembly size</p>
                                            <p className="text-xl font-black text-white italic tracking-tighter">100–150 Distinguished Guests</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 border-l border-primary/20 pl-6">
                                        <MapPin className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Territory</p>
                                            <p className="text-xl font-black text-white italic tracking-tighter uppercase italic">Heart of Ongole, AP</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 italic">Distinguished Events</h4>
                                <div className="flex flex-wrap gap-3">
                                    {['Birthdays', 'Engagements', 'Corporate', 'Gatherings', 'Anniversaries'].map(
                                    event => (
                                        <span key={event} className="uppercase font-black text-[9px] italic tracking-[0.2em] px-4 py-2 border border-white/10 text-white/60 hover:border-primary/40 hover:text-primary transition-all">
                                            {event}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Gem className="h-6 w-6 text-gold" />
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Imperial Amenities</h3>
                                </div>
                                <ul className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: <Star className="h-4 w-4" />, text: "Climate Controlled Palace" },
                                        { icon: <Star className="h-4 w-4" />, text: "Royal Catering Services" },
                                        { icon: <Star className="h-4 w-4" />, text: "Grand Parking Reserve" },
                                        { icon: <Star className="h-4 w-4" />, text: "Imperial Audio Systems" },
                                        { icon: <Star className="h-4 w-4" />, text: "Bespoke Decorations" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-tighter text-white/60 group">
                                            <span className="text-primary opacity-40 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
          </div>

          {/* Booking Form (2 columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card p-10 border border-primary/20 rounded-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <CardHeader className="px-0 pt-0 pb-10 border-b border-white/5 mb-10">
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 italic">
                        Check <span className="text-primary underline decoration-gold/20">Availability</span>
                    </h2>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mt-2">Consult the Palace Scribes</p>
                </CardHeader>
                <CardContent className="px-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Distinguished Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your full title"
                                required
                                className="bg-white/5 border-white/10 rounded-none h-14 font-black uppercase italic italic tracking-tighter focus:border-primary transition-all text-white"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Imperial Line *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="10-digit number"
                                required
                                className="bg-white/5 border-white/10 rounded-none h-14 font-black uppercase italic italic tracking-tighter focus:border-primary transition-all text-white"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Diplomatic Email (Optional)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email-palace.com"
                                className="bg-white/5 border-white/10 rounded-none h-14 font-black uppercase italic italic tracking-tighter focus:border-primary transition-all text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Event Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="bg-white/5 border-white/10 rounded-none h-14 font-black uppercase italic italic tracking-tighter hover:bg-white/10 w-full justify-start text-white/60"
                                    >
                                        <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                                        {eventDate ? format(eventDate, 'PPP') : 'Select Date'}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-background border-white/10 rounded-none">
                                    <Calendar
                                        mode="single"
                                        selected={eventDate}
                                        onSelect={setEventDate}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                        className="font-black h-full"
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="eventType" className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Assembly Type *</Label>
                                <Select value={eventType} onValueChange={setEventType}>
                                    <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-14 font-black uppercase italic italic tracking-tighter text-white/60">
                                    <SelectValue placeholder="Event Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-white/10 rounded-none">
                                    <SelectItem value="birthday" className="font-black uppercase italic tracking-tighter">Birthday</SelectItem>
                                    <SelectItem value="engagement" className="font-black uppercase italic tracking-tighter">Engagement</SelectItem>
                                    <SelectItem value="corporate" className="font-black uppercase italic tracking-tighter">Corporate</SelectItem>
                                    <SelectItem value="family" className="font-black uppercase italic tracking-tighter">Family Gathering</SelectItem>
                                    <SelectItem value="anniversary" className="font-black uppercase italic tracking-tighter">Anniversary</SelectItem>
                                    <SelectItem value="other" className="font-black uppercase italic tracking-tighter">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="guestCount" className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Guest Roll (100-150) *</Label>
                            <Input
                                id="guestCount"
                                type="number"
                                min="100"
                                max="150"
                                value={guestCount}
                                onChange={e => setGuestCount(e.target.value)}
                                placeholder="Number of subjects"
                                required
                                className="bg-white/5 border-white/10 rounded-none h-14 font-black uppercase italic italic tracking-tighter focus:border-primary transition-all text-white"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="notes" className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 ml-1">Additional Ordinances (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Special requirements..."
                                rows={4}
                                className="bg-white/5 border-white/10 rounded-none font-black uppercase italic italic tracking-tighter focus:border-primary transition-all text-white resize-none"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-primary hover:bg-orange-600 text-background h-20 font-black uppercase italic tracking-tighter rounded-none skew-x-[-8deg] shadow-[8px_8px_0_rgba(255,153,51,0.2)] disabled:opacity-50 transition-all active:translate-y-1 active:shadow-none mt-6 group"
                        >
                            <span className="skew-x-[8deg] flex items-center justify-center gap-3">
                                {submitting ? 'Consulting Scrolls...' : 'Dispatch Inquiry'}
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FunctionHallPage;
