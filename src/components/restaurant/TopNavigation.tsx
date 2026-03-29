import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';
import BookingModal from './BookingModal';

const TopNavigation: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Function Hall', path: '#', isBooking: true },
    { name: 'My Orders', path: '/my-orders' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
            scrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border py-2' 
            : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img src="/logo.png" alt="V Grand Restaurant Logo" className="relative h-14 w-14 object-contain md:h-16 md:w-16 drop-shadow-2xl" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter md:text-3xl uppercase leading-none italic" style={{ color: 'var(--brand-red)' }}>
                V GRAND <span className="text-white">RESTAURANT</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link, i) => (
              link.isBooking ? (
                <button
                  key={link.name}
                  onClick={() => setIsBookingOpen(true)}
                  className="relative group h-full"
                >
                  <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors"
                  >
                      {link.name}
                  </motion.span>
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                >
                  <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                          isActive(link.path) ? 'text-primary' : 'text-white/70 group-hover:text-white'
                      }`}
                  >
                      {link.name}
                  </motion.span>
                  <motion.div 
                      layoutId="navUnderline"
                      className={`absolute -bottom-2 left-0 h-[2px] w-full bg-primary opacity-0 transition-opacity ${
                          isActive(link.path) ? 'opacity-100' : 'group-hover:opacity-50'
                      }`}
                  />
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative flex items-center justify-center h-12 w-12 rounded-full border border-white/10 bg-white/5 hover:border-primary/50 transition-all duration-300"
            >
              <ShoppingBag className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
              <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -right-1 -top-1"
                    >
                        <Badge
                        variant="destructive"
                        className="h-6 w-6 flex items-center justify-center rounded-full bg-primary text-background border-2 border-background font-bold text-[10px]"
                        >
                        {totalItems}
                        </Badge>
                    </motion.div>
                  )}
              </AnimatePresence>
            </button>
            <Button asChild className="hidden sm:flex shadow-xl shadow-primary/20">
              <Link to="/menu">Order Now</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                        <Menu className="h-8 w-8" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full bg-background/95 backdrop-blur-2xl border-l border-white/5 p-0">
                    <div className="flex h-full flex-col p-12">
                        <div className="flex items-center justify-between mb-20">
                            <span className="text-2xl font-black italic" style={{ color: 'var(--brand-red)' }}>
                                V GRAND <span className="text-white">RESTAURANT</span>
                            </span>
                        </div>
                        <nav className="flex flex-col gap-8">
                            {navLinks.map((link, i) => (
                                <div key={link.name}>
                                    {link.isBooking ? (
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsBookingOpen(true);
                                            }}
                                            className="text-4xl font-bold uppercase tracking-tight text-white hover:text-primary transition-colors text-left"
                                        >
                                            <motion.span
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                {link.name}
                                            </motion.span>
                                        </button>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`text-4xl font-bold uppercase tracking-tight hover:text-primary transition-colors ${
                                                isActive(link.path) ? 'text-primary' : 'text-white'
                                            }`}
                                        >
                                            <motion.span
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                {link.name}
                                            </motion.span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>
                        <div className="mt-auto pt-12 border-t border-white/5">
                            <Button asChild onClick={() => setIsMenuOpen(false)} className="w-full py-8 text-xl font-bold shadow-2xl shadow-primary/30">
                                <Link to="/menu">Order Online</Link>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
      <BookingModal open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </header>
  );
};

export default TopNavigation;
