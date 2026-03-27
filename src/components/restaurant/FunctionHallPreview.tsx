import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';

const FunctionHallPreview: React.FC = () => {
  return (
    <section className="bg-card py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
          Host Your Special Events
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 h-64 overflow-hidden rounded-lg">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_37d5a87b-3a3d-433a-8297-145a55188950.jpg"
                alt="Function Hall Main View"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="h-48 overflow-hidden rounded-lg">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_74e25857-4a4f-4849-b0cd-f12ac0ad54bf.jpg"
                alt="Function Hall Interior"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="h-48 overflow-hidden rounded-lg">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e1969d65-5557-48e6-8659-8aa6e68f8031.jpg"
                alt="Function Hall Setup"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 text-2xl font-semibold text-foreground">
              V Grand Function Hall
            </h3>
            <p className="mb-6 text-muted-foreground">
              Perfect venue for your special occasions. Our function hall provides a warm and
              elegant atmosphere for birthdays, engagements, corporate events, and family
              gatherings.
            </p>

            <div className="mb-6 space-y-3">
              <Card className="border-border bg-background">
                <CardContent className="flex items-center gap-3 p-4">
                  <Users className="h-6 w-6 text-secondary" />
                  <div>
                    <p className="font-semibold text-foreground">Capacity</p>
                    <p className="text-sm text-muted-foreground">100–150 guests</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-background">
                <CardContent className="flex items-center gap-3 p-4">
                  <Calendar className="h-6 w-6 text-secondary" />
                  <div>
                    <p className="font-semibold text-foreground">Amenities</p>
                    <p className="text-sm text-muted-foreground">
                      AC, Catering Available, Parking, Audio System
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button asChild size="lg">
              <Link to="/function-hall">Book Function Hall</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunctionHallPreview;
