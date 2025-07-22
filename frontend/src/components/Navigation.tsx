'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, getTotalItems } = useCart();
  const { data: session, status } = useSession();
  const { t } = useLanguage();

  const navItems = [
    { href: '/products', label: t('navigation.products') },
    { href: '/categories', label: t('navigation.categories') },
    { href: '/about', label: t('navigation.about') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-neon-cyan hover:scale-105 transition-transform">
{t('navigation.logo')}
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
            <LanguageSwitcher />
            <Link href="/cart" className="relative p-2 hover:text-neon-cyan transition-colors group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-neon-pink text-background text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </Badge>
              )}
            </Link>
            
            {session ? (
              <>
                <Link href="/account" className="p-2 hover:text-neon-cyan transition-colors">
                  <User size={20} />
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
{t('navigation.hi')}{session.user?.name?.split(' ')[0] || session.user?.email}
                  </span>
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:text-neon-cyan transition-colors"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-background rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  {t('navigation.signIn')}
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-4 py-2 border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-background transition-all duration-300"
                >
                  {t('navigation.signUp')}
                </Link>
              </>
            )}
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
                  <span>{t('navigation.cart')} ({getTotalItems()})</span>
                </Link>
                {session && (
                  <Link 
                    href="/account" 
                    className="flex items-center space-x-2 hover:text-neon-cyan transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>{t('navigation.account')}</span>
                  </Link>
                )}
              </div>
              
              {session ? (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
  {t('navigation.hi')}{session.user?.name?.split(' ')[0] || session.user?.email}
                    </span>
                    <Button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:text-neon-cyan transition-colors"
                    >
                      <LogOut size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    href="/auth/signin" 
                    className="block px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-background rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navigation.signIn')}
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-4 py-2 border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-background transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navigation.signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}