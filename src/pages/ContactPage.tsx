import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Mail, MessageSquare, Navigation, Share2, Sparkles, Instagram, Facebook, Globe } from 'lucide-react';

const ContactPage: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:+919876543210';
  };

  const handleWhatsApp = () => {
    const phone = '+919876543210';
    const message = 'Greetings, I wish to inquire about the Grand Feast...';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-32 overflow-hidden">
      {/* Cinematic Header */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3e782de9-74f2-46b9-a3c6-d6c518bdd5c7.jpg')] bg-cover bg-fixed bg-center grayscale opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-1 border border-primary text-primary text-xs uppercase tracking-[0.5em] font-bold mb-8"
            >
                V Grand Restaurant Legacy
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-bold text-white uppercase tracking-tight leading-tight"
            >
                The <span className="text-gold underline decoration-primary/20">Palace</span>
            </motion.h1>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <Card className="bg-card/40 backdrop-blur-3xl border-white/5 rounded-[2rem] p-10 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="h-40 w-40 text-primary" />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary">Establishment Details</h2>
                    <h3 className="text-5xl font-bold text-white uppercase tracking-tight leading-tight">Connect with <span className="text-gold">Grandeur</span></h3>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6 group/item">
                    <div className="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl group-hover/item:border-primary/50 transition-all">
                        <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Royal Address</h4>
                      <p className="text-xl font-bold text-white tracking-tight uppercase leading-tight">
                        Main Road, Ongole<br/>
                        <span className="text-white/40">Andhra Pradesh, India</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center skew-x-[-12deg] group-hover/item:border-primary/50 transition-all">
                        <Phone className="h-6 w-6 text-primary skew-x-[12deg]" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Direct Communication</h4>
                        <p className="text-3xl font-bold text-white tracking-tight leading-normal">+91 98765 43210</p>
                      </div>
                      <div className="flex gap-4">
                        <Button 
                            onClick={handleCall} 
                            className="h-14 px-8 shadow-xl shadow-primary/20"
                        >
                          <span className="flex items-center gap-2">Call Now</span>
                        </Button>
                        <Button 
                            onClick={handleWhatsApp} 
                            variant="outline"
                            className="border-white/10 text-white/60 hover:text-white h-14 px-8 rounded-full"
                        >
                          <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4 mr-2" /> WhatsApp</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center skew-x-[-12deg] group-hover/item:border-primary/50 transition-all">
                        <Mail className="h-6 w-6 text-primary skew-x-[12deg]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Diplomatic Inquiries</h4>
                      <p className="text-xl font-bold text-white tracking-tight lowercase underline decoration-primary/20">info@vgrandrestaurant.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center skew-x-[-12deg] group-hover/item:border-primary/50 transition-all">
                        <Clock className="h-6 w-6 text-primary skew-x-[12deg]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Open for Audience</h4>
                      <p className="text-xl font-bold text-white tracking-tight uppercase leading-tight">11:00 AM - 11:00 PM</p>
                      <p className="text-[10px] font-bold tracking-[0.2em] text-primary">Serving Every Day</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-wrap gap-6">
                    <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/20">Follow the Legacy</h4>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Globe].map((Icon, i) => (
                                <button key={i} className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all hover:scale-110">
                                    <Icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Google Maps & Logistics */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <Card className="bg-white/2 border-white/5 rounded-[2rem] overflow-hidden relative h-[450px] shadow-2xl">
                <div className="absolute inset-0 grayscale contrast-125 brightness-50">
                    <iframe
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&q=Ongole,Andhra+Pradesh,India&language=en&region=in"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Palace Location"
                    />
                </div>
                <div className="absolute inset-0 pointer-events-none border-[20px] border-background/20" />
                <div className="absolute bottom-10 right-10">
                    <Button
                    onClick={() =>
                        window.open('https://www.google.com/maps/search/?api=1&query=Ongole,Andhra+Pradesh,India','_blank')
                    }
                    className="h-14 px-8 shadow-2xl"
                    >
                        <span className="flex items-center gap-2"><Navigation className="h-4 w-4" /> Get Directions</span>
                    </Button>
                </div>
            </Card>

            <Card className="bg-card/30 backdrop-blur-xl border-white/5 rounded-[2rem] p-10 shadow-2xl">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Share2 className="h-5 w-5 text-gold" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1 leading-tight">Royal Delivery Protocol</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {[
                            { label: "Free Corridor", desc: "Within 10km (Orders ₹300+)" },
                            { label: "Extended Realm", desc: "₹50 Charge beyond 10km" },
                            { label: "Minor Tribute", desc: "₹30 Fee for orders below ₹300" },
                            { label: "Imperial Speed", desc: "30-35 Royal Minutes" }
                        ].map((item, i) => (
                            <div key={i} className="border-l-2 border-primary/20 pl-4 py-1 hover:border-primary transition-colors">
                                <h4 className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{item.label}</h4>
                                <p className="text-sm font-bold text-white tracking-tight">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
