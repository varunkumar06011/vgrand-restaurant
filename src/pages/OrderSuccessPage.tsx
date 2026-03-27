import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12">
          <CheckCircle2 className="mb-4 h-20 w-20 text-secondary" />
          <h2 className="mb-2 text-3xl font-bold text-foreground">Order Placed! 🎉</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Your order has been placed successfully. We'll call you shortly to confirm.
          </p>

          <div className="mb-6 w-full rounded-lg border border-secondary bg-secondary/10 p-4">
            <p className="text-center font-medium text-foreground">
              🚀 Estimated Delivery: 30–35 minutes
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate('/my-orders')} variant="outline" className="flex-1">
              View My Orders
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
              Back to Home
            </Button>
            <Button onClick={() => navigate('/menu')} className="flex-1">
              Order Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
