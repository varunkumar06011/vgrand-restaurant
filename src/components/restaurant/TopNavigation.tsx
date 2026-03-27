import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

const TopNavigation: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'My Orders', path: '/my-orders' },
    { name: 'Function Hall', path: '/function-hall' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-bold text-foreground md:text-2xl">
              V GRAND RESTAURANT
            </span>
            <span className="text-xs text-secondary md:text-sm">Raja of Biryanis</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  isActive(link.path) ? 'text-secondary' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-6 w-6 text-foreground transition-colors hover:text-secondary" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </button>
            <Button asChild variant="default" size="lg">
              <Link to="/menu">Order Now</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 pt-8">
                <Link to="/" className="mb-4 flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    V GRAND RESTAURANT
                  </span>
                  <span className="text-xs text-secondary">Raja of Biryanis</span>
                </Link>
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base font-medium transition-colors hover:text-secondary ${
                      isActive(link.path) ? 'text-secondary' : 'text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button asChild variant="default" size="lg" className="mt-4">
                  <Link to="/menu">Order Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
};

export default TopNavigation;
