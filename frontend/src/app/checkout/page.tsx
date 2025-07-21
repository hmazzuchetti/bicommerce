'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Mail, User, MapPin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().min(2, 'Please enter a valid state'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),
  country: z.string().min(2, 'Please enter a valid country'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [orderData, setOrderData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="text-8xl mb-6">📦</div>
            <h1 className="text-3xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
              Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              You need items in your cart to proceed with checkout.
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Create order in backend
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: `${data.firstName} ${data.lastName}`,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
          },
          customerEmail: data.email,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // Step 2: Create payment intent
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await paymentResponse.json();

      // For demo purposes, simulate successful payment
      // In production, you would integrate with Stripe Elements here
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setOrderData({
        ...order,
        customerInfo: data,
        paymentIntentId,
      });

      clearCart();
      setStep('confirmation');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
              Order Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            
            <Card className="border-border bg-card/50 backdrop-blur-sm mb-8">
              <CardContent className="p-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Order ID:</strong><br />
                    {orderData?.id}
                  </div>
                  <div>
                    <strong>Email:</strong><br />
                    {orderData?.customerInfo?.email}
                  </div>
                  <div>
                    <strong>Total:</strong><br />
                    <span className="text-neon-cyan font-bold">${orderData?.total}</span>
                  </div>
                  <div>
                    <strong>Status:</strong><br />
                    <span className="text-green-400">Confirmed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                We've sent a confirmation email to{' '}
                <span className="text-neon-cyan">{orderData?.customerInfo?.email}</span>
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/my-orders">
                  <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    View Orders
                  </Button>
                </Link>
              </div>
            </div>
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
            href="/cart" 
            className="inline-flex items-center text-neon-cyan hover:text-cyan-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
            Checkout
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neon-cyan">
                    <User className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="your@email.com"
                        className="bg-background/50"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input
                          {...register('firstName')}
                          placeholder="John"
                          className="bg-background/50"
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input
                          {...register('lastName')}
                          placeholder="Doe"
                          className="bg-background/50"
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address
                      </label>
                      <Input
                        {...register('address')}
                        placeholder="123 Main Street"
                        className="bg-background/50"
                      />
                      {errors.address && (
                        <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <Input
                          {...register('city')}
                          placeholder="New York"
                          className="bg-background/50"
                        />
                        {errors.city && (
                          <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <Input
                          {...register('state')}
                          placeholder="NY"
                          className="bg-background/50"
                        />
                        {errors.state && (
                          <p className="text-destructive text-sm mt-1">{errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Zip Code</label>
                        <Input
                          {...register('zipCode')}
                          placeholder="10001"
                          className="bg-background/50"
                        />
                        {errors.zipCode && (
                          <p className="text-destructive text-sm mt-1">{errors.zipCode.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <Input
                          {...register('country')}
                          placeholder="United States"
                          className="bg-background/50"
                        />
                        {errors.country && (
                          <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-lg py-6 mt-6"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      {isProcessing ? 'Processing...' : 'Complete Order'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Your payment information is secure and encrypted
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0] || '/placeholder.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-neon-cyan">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}