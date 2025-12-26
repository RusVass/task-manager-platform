import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { getAllUsers, setBlocked } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', checkAuth, requireRole('admin'), getAllUsers);
router.patch('/users/:id/block', checkAuth, requireRole('admin'), setBlocked);

export default router;

