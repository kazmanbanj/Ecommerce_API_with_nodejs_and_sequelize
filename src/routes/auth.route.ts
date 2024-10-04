import express from 'express';
import { signup, login, profile } from '../controller/auth.controller';
import authMiddleware from '../middleware/is-auth'
import { signupValidation, loginValidation } from '../validation/auth.validation';

const authRoutes = express.Router();

authRoutes.post('/signup', signupValidation, signup);
authRoutes.post('/login', loginValidation, login);
authRoutes.get('/profile', authMiddleware, profile);


export default authRoutes;