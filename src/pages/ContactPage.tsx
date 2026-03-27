import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:+919876543210';
  };

  const handleWhatsApp = () => {
    const phone = '+919876543210';
    const message = 'Hi, I would like to know more about V Grand Restaurant';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground md:text-5xl">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-foreground">
                    V Grand Restaurant
                  </h2>
                  <p className="text-lg text-secondary">Raja of Biryanis</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-6 w-6 text-secondary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                      <p className="text-muted-foreground">
                        Main Road, Ongole
                        <br />
                        Andhra Pradesh, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-6 w-6 text-secondary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <div className="mt-2 flex gap-2">
                        <Button onClick={handleCall} size="sm">
                          Call Now
                        </Button>
                        <Button onClick={handleWhatsApp} size="sm" variant="outline">
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-6 w-6 text-secondary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">info@vgrandrestaurant.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 h-6 w-6 text-secondary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Monday - Sunday: 11:00 AM - 11:00 PM</p>
                        <p className="text-secondary">Open all days</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-secondary bg-secondary/10 p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Delivery Information</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Free delivery within 10km</li>
                    <li>✓ Delivery time: 30–35 minutes</li>
                    <li>✓ Minimum order: ₹200</li>
                    <li>✓ Cash on Delivery available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&q=Ongole,Andhra+Pradesh,India&language=en&region=in"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="V Grand Restaurant Location"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Get Directions</h3>
                <p className="mb-4 text-muted-foreground">
                  We're located in the heart of Ongole, easily accessible from all parts of the city.
                </p>
                <Button
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/?api=1&query=Ongole,Andhra+Pradesh,India',
                      '_blank'
                    )
                  }
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media / Additional Info */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="mb-4 text-xl font-semibold text-foreground">Follow Us</h3>
            <p className="mb-4 text-muted-foreground">
              Stay updated with our latest offers and menu additions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => window.open('https://facebook.com', '_blank')}>Facebook</Button>
              <Button variant="outline" onClick={() => window.open('https://instagram.com', '_blank')}>Instagram</Button>
              <Button variant="outline" onClick={() => window.open('https://zomato.com', '_blank')}>Zomato</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
