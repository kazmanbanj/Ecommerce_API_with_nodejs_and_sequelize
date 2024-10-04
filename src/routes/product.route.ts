import express from 'express';
import {getProducts, getProduct, createProduct, deleteProduct, editProduct } from '../controller/product.controller';
import { productCreationValidation } from '../validation/product.validation';
import authMiddleware from '../middleware/is-auth'

const productRoutes = express.Router();

productRoutes.get('/products', authMiddleware, getProducts);
productRoutes.get('/products/:id', authMiddleware, getProduct);
productRoutes.put('/products/:id', authMiddleware, productCreationValidation, editProduct);
productRoutes.post('/products', authMiddleware, productCreationValidation, createProduct);
productRoutes.delete('/products/:id', authMiddleware, deleteProduct);

export default productRoutes;