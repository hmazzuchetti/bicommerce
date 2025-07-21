'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any amazing products to your cart yet. 
              Let's change that!
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link 
            href="/products" 
            className="inline-flex items-center text-neon-cyan hover:text-cyan-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-border bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0] || '/placeholder.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/products/${item.product.slug}`}
                            className="font-semibold text-lg hover:text-neon-cyan transition-colors block mb-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-2xl font-bold text-neon-cyan mb-4">
                            ${item.product.price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-border rounded-lg bg-background/50">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="h-10 w-10 p-0 hover:bg-destructive/20"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 0)}
                                className="h-10 w-16 text-center border-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="0"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="h-10 w-10 p-0 hover:bg-neon-cyan/20"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-orbitron)] text-neon-cyan">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-neon-cyan">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-lg py-6"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}