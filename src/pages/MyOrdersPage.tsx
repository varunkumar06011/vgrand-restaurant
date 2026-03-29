import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Clock, CheckCircle, XCircle, RefreshCw, History, Phone, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { verifyStripePayment } from '@/db/api';
import { toast } from 'sonner';

const MyOrdersPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phoneNumber.trim() || !/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error('The Royal Scribes require a valid 10-digit line.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      // In a real implementation, you would fetch orders by phone number
      toast.info('Imperial Records Search is undergoing maintenance. Logic remains intact.');
      setOrders([]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to retrieve your royal history.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (sessionId: string) => {
    try {
      const result = await verifyStripePayment(sessionId);
      if (result.verified) {
        toast.success('Your tribute has been verified!', {
            icon: <Sparkles className="h-4 w-4 text-primary" />,
            style: { background: '#1A1A1A', color: '#FF9933', border: '1px solid #FF9933' }
        });
        handleSearch(); // Refresh orders
      } else {
        toast.error('The tribute is still in transit.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification ritual failed.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gold" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-white/40" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-full font-bold uppercase tracking-wide">Served</Badge>;
      case 'pending':
        return <Badge className="bg-gold/10 text-gold border-gold/20 rounded-full font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(212,175,55,0.2)]">En Route</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 rounded-full font-bold uppercase tracking-wide">Halted</Badge>;
      default:
        return <Badge variant="outline" className="text-white/40 border-white/10 rounded-full font-bold uppercase tracking-wide">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cinematic Header */}
      <div className="relative h-[45vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3e782de9-74f2-46b9-a3c6-d6c518bdd5c7.jpg')] bg-cover bg-center grayscale opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 text-center px-4 pt-12 sm:pt-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-3 py-1 border border-primary text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-6 md:mb-8"
            >
                Order Archives
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold text-white uppercase tracking-tight leading-tight"
            >
                My <span className="text-gold underline decoration-primary/20">History</span>
            </motion.h1>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 -mt-16 relative z-20">
        {/* Search Section */}
            <div className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white focus:outline-none">Track Your Legacy</h2>
            </div>
            
            <div className="flex flex-col gap-6 lg:flex-row items-end">
              <div className="flex-1 w-full space-y-3">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 ml-1">Communication Line</Label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        maxLength={10}
                        className="bg-white/5 border-white/10 rounded-2xl h-16 pl-14 text-xl font-bold tracking-tight focus:border-primary transition-all text-white"
                    />
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading} 
                className="w-full sm:h-16 h-14 px-8 md:px-12 shadow-xl shadow-primary/20 disabled:opacity-50 transition-all active:translate-y-1 active:shadow-none"
              >
                <span className="flex items-center gap-3">
                    <Search className="h-5 w-5" />
                    {loading ? 'Consulting Records...' : 'Search History'}
                </span>
              </Button>
            </div>
        </div>

        {/* Orders List */}
        <div className="mt-20">
            <AnimatePresence mode="wait">
                {searched && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {orders.length === 0 ? (
                        <div className="bg-white/2 p-20 border border-white/5 text-center skew-x-[1deg]">
                            <div className="skew-x-[-1deg] flex flex-col items-center">
                                <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 transition-transform hover:scale-110">
                                    <Sparkles className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold uppercase tracking-tight text-white mb-4">Make your tummy full</h3>
                                <p className="text-white/20 mb-10 max-w-sm mx-auto uppercase tracking-widest text-[10px] font-bold leading-relaxed">
                                    Our scrolls show no record of this line. Perhaps it is time to begin your imperial journey?
                                </p>
                                <Button 
                                    onClick={() => window.location.href = '/menu'}
                                    className="px-10 py-6 shadow-xl shadow-primary/20"
                                >
                                    <span className="flex items-center gap-2">Order Now <ArrowRight className="h-4 w-4" /></span>
                                </Button>
                            </div>
                        </div>
                        ) : (
                        <div className="space-y-16">
                            {/* Ongoing Orders */}
                            {orders.some(o => o.status === 'pending') && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-gold border-l-4 border-gold pl-4">Enjoying the Wait (Ongoing)</h3>
                                    <div className="space-y-8">
                                        {orders.filter(o => o.status === 'pending').map((order: any, idx: number) => (
                                          <motion.div 
                                              key={order.id}
                                              initial={{ opacity: 0, x: -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: idx * 0.1 }}
                                              className="group"
                                          >
                                              <Card className="bg-card/40 backdrop-blur-3xl border-white/5 hover:border-primary/20 transition-all duration-500 rounded-none overflow-hidden hover:shadow-[0_0_50px_rgba(255,153,51,0.05)]">
                                                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all duration-500" />
                                                  <CardHeader className="pb-4">
                                                      <div className="flex flex-wrap items-start justify-between gap-6">
                                                          <div className="space-y-1">
                                                              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
                                                                  Order <span className="text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                              </CardTitle>
                                                              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 italic">
                                                                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                                  })}
                                                              </p>
                                                          </div>
                                                          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 border border-white/10 skew-x-[-12deg]">
                                                              <div className="skew-x-[12deg] flex items-center gap-3">
                                                                  {getStatusIcon(order.status)}
                                                                  {getStatusBadge(order.status)}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </CardHeader>
                                                  <CardContent className="space-y-8 pt-6">
                                                      {/* Order Items */}
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                          <div className="space-y-4">
                                                              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-2">Artifacts</h4>
                                                              <div className="space-y-3">
                                                                  {order.items.map((item: any, i: number) => (
                                                                      <div key={i} className="flex justify-between items-center group/item">
                                                                          <span className="text-sm font-black uppercase italic tracking-tighter text-white/60 group-hover/item:text-white transition-colors">
                                                                              {item.name} <span className="text-primary/40 ml-2">x{item.quantity}</span>
                                                                          </span>
                                                                          <span className="text-sm font-black text-white italic">
                                                                              ₹{item.price * item.quantity}
                                                                          </span>
                                                                      </div>
                                                                  ))}
                                                              </div>
                                                          </div>

                                                          <div className="space-y-4">
                                                              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-2">Logistics</h4>
                                                              <div className="space-y-3 text-xs uppercase tracking-widest font-bold text-white/40">
                                                                  <div className="flex justify-between">
                                                                      <span>Receiver</span>
                                                                      <span className="text-white italic">{order.customer_name}</span>
                                                                  </div>
                                                                  <div className="flex justify-between">
                                                                      <span>Imperial Line</span>
                                                                      <span className="text-white italic">{order.customer_phone}</span>
                                                                  </div>
                                                                  <div className="flex justify-between items-start text-right">
                                                                      <span>Palace</span>
                                                                      <span className="text-white italic max-w-[200px] line-clamp-2">{order.delivery_address}</span>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>

                                                      <div className="flex flex-wrap items-end justify-between gap-8 pt-6 border-t border-white/5">
                                                          <div className="flex items-center gap-4">
                                                              <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-3 px-6">
                                                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tribute</span>
                                                                  <span className="text-3xl font-black text-primary italic tracking-tighter">₹{order.total_amount}</span>
                                                              </div>
                                                              <Badge variant="outline" className="border-white/10 text-white/30 rounded-none h-full px-4 uppercase font-black italic tracking-tighter">
                                                                  {order.payment_method === 'cod' ? 'Cash' : 'Portal'}
                                                              </Badge>
                                                          </div>

                                                          {order.status === 'pending' && order.stripe_session_id && (
                                                              <Button
                                                                  onClick={() => handleVerifyPayment(order.stripe_session_id)}
                                                                  className="bg-gold hover:bg-yellow-600 text-background font-black uppercase italic tracking-tighter rounded-none px-8 py-4 skew-x-[-12deg] shadow-[6px_6px_0_rgba(212,175,55,0.2)]"
                                                              >
                                                                  <span className="skew-x-[12deg] flex items-center gap-2">
                                                                      <RefreshCw className="h-4 w-4" />
                                                                      Verify Tribute
                                                                  </span>
                                                              </Button>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </Card>
                                          </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Orders */}
                            {orders.some(o => o.status !== 'pending') && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white/40 border-l-4 border-white/10 pl-4">Imperial Memories (Past)</h3>
                                    <div className="space-y-8 opacity-60 hover:opacity-100 transition-opacity">
                                        {orders.filter(o => o.status !== 'pending').map((order: any, idx: number) => (
                                          <motion.div 
                                              key={order.id}
                                              initial={{ opacity: 0, x: -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: idx * 0.1 }}
                                              className="group"
                                          >
                                              <Card className="bg-card/40 backdrop-blur-3xl border-white/5 hover:border-primary/20 transition-all duration-500 rounded-none overflow-hidden hover:shadow-[0_0_50px_rgba(255,153,51,0.05)]">
                                                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all duration-500" />
                                                  <CardHeader className="pb-4">
                                                      <div className="flex flex-wrap items-start justify-between gap-6">
                                                          <div className="space-y-1">
                                                              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
                                                                  Order <span className="text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                              </CardTitle>
                                                              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 italic">
                                                                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                                  })}
                                                              </p>
                                                          </div>
                                                          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 border border-white/10 skew-x-[-12deg]">
                                                              <div className="skew-x-[12deg] flex items-center gap-3">
                                                                  {getStatusIcon(order.status)}
                                                                  {getStatusBadge(order.status)}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </CardHeader>
                                                  <CardContent className="space-y-8 pt-6">
                                                      {/* Order Items */}
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                          <div className="space-y-4">
                                                              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-2">Artifacts</h4>
                                                              <div className="space-y-3">
                                                                  {order.items.map((item: any, i: number) => (
                                                                      <div key={i} className="flex justify-between items-center group/item">
                                                                          <span className="text-sm font-black uppercase italic tracking-tighter text-white/60 group-hover/item:text-white transition-colors">
                                                                              {item.name} <span className="text-primary/40 ml-2">x{item.quantity}</span>
                                                                          </span>
                                                                          <span className="text-sm font-black text-white italic">
                                                                              ₹{item.price * item.quantity}
                                                                          </span>
                                                                      </div>
                                                                  ))}
                                                              </div>
                                                          </div>

                                                          <div className="space-y-4">
                                                              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-2">Logistics</h4>
                                                              <div className="space-y-3 text-xs uppercase tracking-widest font-bold text-white/40">
                                                                  <div className="flex justify-between">
                                                                      <span>Receiver</span>
                                                                      <span className="text-white italic">{order.customer_name}</span>
                                                                  </div>
                                                                  <div className="flex justify-between">
                                                                      <span>Imperial Line</span>
                                                                      <span className="text-white italic">{order.customer_phone}</span>
                                                                  </div>
                                                                  <div className="flex justify-between items-start text-right">
                                                                      <span>Palace</span>
                                                                      <span className="text-white italic max-w-[200px] line-clamp-2">{order.delivery_address}</span>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>

                                                      <div className="flex flex-wrap items-end justify-between gap-8 pt-6 border-t border-white/5">
                                                          <div className="flex items-center gap-4">
                                                              <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-3 px-6">
                                                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tribute</span>
                                                                  <span className="text-3xl font-black text-primary italic tracking-tighter">₹{order.total_amount}</span>
                                                              </div>
                                                              <Badge variant="outline" className="border-white/10 text-white/30 rounded-none h-full px-4 uppercase font-black italic tracking-tighter">
                                                                  {order.payment_method === 'cod' ? 'Cash' : 'Portal'}
                                                              </Badge>
                                                          </div>

                                                          {order.status === 'pending' && order.stripe_session_id && (
                                                              <Button
                                                                  onClick={() => handleVerifyPayment(order.stripe_session_id)}
                                                                  className="bg-gold hover:bg-yellow-600 text-background font-black uppercase italic tracking-tighter rounded-none px-8 py-4 skew-x-[-12deg] shadow-[6px_6px_0_rgba(212,175,55,0.2)]"
                                                              >
                                                                  <span className="skew-x-[12deg] flex items-center gap-2">
                                                                      <RefreshCw className="h-4 w-4" />
                                                                      Verify Tribute
                                                                  </span>
                                                              </Button>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </Card>
                                          </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Help Section */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 p-12 border border-primary/20 bg-primary/5 text-center relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative z-10">
                <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
                <h3 className="text-3xl font-bold uppercase tracking-tight text-white mb-4">Required Assistance?</h3>
                <p className="text-white/40 mb-10 max-w-lg mx-auto uppercase tracking-[0.2em] text-[10px] font-bold leading-relaxed">
                    Direct communication lines to the royal kitchen are available for your queries.
                </p>
                <div className="flex justify-center flex-wrap gap-6">
                <Button
                    onClick={() => window.location.href = 'tel:+919876543210'}
                    className="h-14 px-10 rounded-full shadow-lg shadow-white/5"
                >
                    <span className="flex items-center gap-3"><Phone className="h-4 w-4" /> Direct Line</span>
                </Button>
                <Button
                    onClick={() => {
                    const phone = '+919876543210';
                    const message = 'Greetings, I require assistance with میرا آرڈر...';
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    variant="outline"
                    className="h-14 px-10 rounded-full border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                    <span className="flex items-center gap-3"><MessageSquare className="h-4 w-4" /> Royal Messenger</span>
                </Button>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
