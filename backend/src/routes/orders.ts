import express from 'express';
import { 
  getUserOrders, 
  getOrderById, 
  createOrder,
  getAllOrders
} from '../controllers/orderController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Protected routes (require authentication)
router.get('/my-orders', auth, getUserOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);

// Admin routes
router.get('/', auth, adminAuth, getAllOrders);

export default router;