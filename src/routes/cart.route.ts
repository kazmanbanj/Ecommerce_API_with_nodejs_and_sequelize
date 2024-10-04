import express from 'express';
import { createCart } from '../controller/cart.controller';
import authMiddleware from '../middleware/is-auth';
import { cartCreationValidation } from '../validation/cart.validation';

const cartRoutes = express.Router();

cartRoutes.post('/', authMiddleware, cartCreationValidation, createCart);
// cartRoutes.get('/products', authMiddleware, getProducts);
// cartRoutes.get('/products/:id', authMiddleware, getProduct);
// cartRoutes.put('/products/:id', authMiddleware, productCreationValidation, editProduct);
// cartRoutes.delete('/products/:id', authMiddleware, deleteProduct);

export default cartRoutes;