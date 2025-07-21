import express from 'express';
import { 
  createPaymentIntent,
  handleWebhook,
  createStripeProduct,
  updateStripeProduct,
  deleteStripeProduct
} from '../controllers/stripeController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Payment routes
router.post('/create-payment-intent', auth, createPaymentIntent);

// Webhook route (no auth needed, verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Product sync routes (admin only)
router.post('/products', auth, adminAuth, createStripeProduct);
router.put('/products/:id', auth, adminAuth, updateStripeProduct);
router.delete('/products/:id', auth, adminAuth, deleteStripeProduct);

export default router;