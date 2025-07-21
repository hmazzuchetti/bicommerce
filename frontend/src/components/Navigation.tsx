'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, getTotalItems } = useCart();

  const navItems = [
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-neon-cyan hover:scale-105 transition-transform">
            BiCommerce
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-neon-cyan transition-colors ${
                  isActive(item.href) ? 'text-neon-cyan' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 hover:text-neon-cyan transition-colors group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-neon-pink text-background text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </Badge>
              )}
            </Link>
            <Link href="/account" className="p-2 hover:text-neon-cyan transition-colors">
              <User size={20} />
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-background rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-neon-cyan transition-colors ${
                    isActive(item.href) ? 'text-neon-cyan' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-border">
                <Link 
                  href="/cart" 
                  className="flex items-center space-x-2 hover:text-neon-cyan transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={20} />
                  <span>Cart ({getTotalItems()})</span>
                </Link>
                <Link 
                  href="/account" 
                  className="flex items-center space-x-2 hover:text-neon-cyan transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Account</span>
                </Link>
              </div>
              <Link 
                href="/auth/signin" 
                className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-background rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}