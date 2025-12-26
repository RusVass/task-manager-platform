import express from 'express';
import * as authController from '../controllers/authController.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', checkAuth, authController.profile);

export default router;
