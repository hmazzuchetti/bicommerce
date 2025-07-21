import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Create payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Fetch the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
        paymentStatus: 'PENDING'
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    if (!order) {
      return res
        .status(404)
        .json({ error: 'Order not found or already processed' });
    }

    // Calculate amount in cents
    const amount = Math.round(Number(order.total) * 100);

    // Create or update payment intent
    let paymentIntent;

    if (order.paymentIntentId) {
      // Update existing payment intent
      paymentIntent = await stripe.paymentIntents.update(
        order.paymentIntentId,
        {
          amount
        }
      );
    } else {
      // Create new payment intent
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd', // Change to 'brl' for Brazilian Real if needed
        payment_method_types: ['card'],
        metadata: {
          orderId: order.id,
          userId: order.userId
        },
        description: `Order ${order.id} - BiCommerce`,
        receipt_email: order.user.email
      });

      // Update order with payment intent ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentIntentId: paymentIntent.id,
          paymentStatus: 'PROCESSING'
        }
      });
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

// Handle Stripe webhooks
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Handle successful payment
const handlePaymentIntentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const orderId = paymentIntent.metadata.orderId;

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'SUCCEEDED',
        status: 'CONFIRMED'
      }
    });

    console.log(`Payment succeeded for order ${orderId}`);
  }
};

// Handle failed payment
const handlePaymentIntentFailed = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const orderId = paymentIntent.metadata.orderId;

  if (orderId) {
    // Restore inventory for failed payments
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true
      }
    });

    if (order) {
      // Restore inventory
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              increment: item.quantity
            }
          }
        });
      }

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
          status: 'CANCELLED'
        }
      });
    }

    console.log(`Payment failed for order ${orderId}`);
  }
};

// Handle canceled payment
const handlePaymentIntentCanceled = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const orderId = paymentIntent.metadata.orderId;

  if (orderId) {
    // Restore inventory for canceled payments
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true
      }
    });

    if (order) {
      // Restore inventory
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              increment: item.quantity
            }
          }
        });
      }

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'CANCELLED',
          status: 'CANCELLED'
        }
      });
    }

    console.log(`Payment canceled for order ${orderId}`);
  }
};

// Create Stripe product (when admin creates a product)
export const createStripeProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Fetch the product from database
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stripeProductId) {
      return res
        .status(400)
        .json({ error: 'Product already exists in Stripe' });
    }

    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description || undefined,
      images: product.images,
      metadata: {
        productId: product.id
      }
    });

    // Create price in Stripe
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(Number(product.price) * 100),
      currency: 'usd',
      product: stripeProduct.id
    });

    // Update product with Stripe IDs
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id
      }
    });

    res.json({
      product: updatedProduct,
      stripeProduct,
      stripePrice
    });
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    res.status(500).json({ error: 'Failed to create Stripe product' });
  }
};

// Update Stripe product
export const updateStripeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch the product from database
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.stripeProductId) {
      return res.status(400).json({ error: 'Product not synced with Stripe' });
    }

    // Update product in Stripe
    const stripeProduct = await stripe.products.update(
      product.stripeProductId,
      {
        name: product.name,
        description: product.description || undefined,
        images: product.images
      }
    );

    // If price changed, create new price and update
    if (req.body.priceChanged) {
      const stripePrice = await stripe.prices.create({
        unit_amount: Math.round(Number(product.price) * 100),
        currency: 'usd',
        product: product.stripeProductId
      });

      // Archive old price
      if (product.stripePriceId) {
        await stripe.prices.update(product.stripePriceId, {
          active: false
        });
      }

      // Update product with new price ID
      await prisma.product.update({
        where: { id },
        data: {
          stripePriceId: stripePrice.id
        }
      });
    }

    res.json({ stripeProduct });
  } catch (error) {
    console.error('Error updating Stripe product:', error);
    res.status(500).json({ error: 'Failed to update Stripe product' });
  }
};

// Delete Stripe product
export const deleteStripeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch the product from database
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.stripeProductId) {
      return res.status(400).json({ error: 'Product not synced with Stripe' });
    }

    // Archive product in Stripe (can't delete products with prices)
    await stripe.products.update(product.stripeProductId, {
      active: false
    });

    // Archive price in Stripe
    if (product.stripePriceId) {
      await stripe.prices.update(product.stripePriceId, {
        active: false
      });
    }

    // Remove Stripe IDs from database
    await prisma.product.update({
      where: { id },
      data: {
        stripeProductId: null,
        stripePriceId: null
      }
    });

    res.json({ message: 'Stripe product archived successfully' });
  } catch (error) {
    console.error('Error deleting Stripe product:', error);
    res.status(500).json({ error: 'Failed to delete Stripe product' });
  }
};
