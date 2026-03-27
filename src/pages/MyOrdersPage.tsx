import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { verifyStripePayment } from '@/db/api';
import { toast } from 'sonner';

const MyOrdersPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phoneNumber.trim() || !/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      // In a real implementation, you would fetch orders by phone number
      // For now, we'll show a message
      toast.info('Order search functionality requires backend implementation');
      setOrders([]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (sessionId: string) => {
    try {
      const result = await verifyStripePayment(sessionId);
      if (result.verified) {
        toast.success('Payment verified successfully!');
        handleSearch(); // Refresh orders
      } else {
        toast.error('Payment not completed yet');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify payment');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-secondary" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-secondary text-secondary-foreground">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground">My Orders</h1>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Track Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? 'Searching...' : 'Search Orders'}
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the phone number you used while placing the order
            </p>
          </CardContent>
        </Card>

        {/* Orders List */}
        {searched && (
          <>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-12">
                  <Package className="mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-semibold text-foreground">No Orders Found</h3>
                  <p className="mb-6 text-center text-muted-foreground">
                    We couldn't find any orders with this phone number.
                  </p>
                  <Button onClick={() => window.location.href = '/menu'}>
                    Start Ordering
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="mb-2 font-semibold text-foreground">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="font-medium text-foreground">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Order Details */}
                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground">Customer Name:</span>
                          <p className="font-medium text-foreground">{order.customer_name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium text-foreground">{order.customer_phone}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-muted-foreground">Delivery Address:</span>
                          <p className="font-medium text-foreground">{order.delivery_address}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment Method:</span>
                          <p className="font-medium text-foreground">
                            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Amount:</span>
                          <p className="text-lg font-bold text-secondary">₹{order.total_amount}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {order.status === 'pending' && order.stripe_session_id && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleVerifyPayment(order.stripe_session_id)}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Verify Payment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold text-foreground">Need Help?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              If you have any questions about your order, please contact us:
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => window.location.href = 'tel:+919876543210'}
                variant="outline"
                size="sm"
              >
                Call Us
              </Button>
              <Button
                onClick={() => {
                  const phone = '+919876543210';
                  const message = 'Hi, I need help with my order';
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                variant="outline"
                size="sm"
              >
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyOrdersPage;
