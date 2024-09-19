import express from 'express';
import {getProducts, getProduct, createProduct, editProduct, deleteProduct } from '../controller/product.controller';
import { check, ValidationChain } from 'express-validator';
import authMiddleware from '../middleware/is-auth'

const productRoutes = express.Router();

const productCreationValidation: ValidationChain[] = [
    check('title').trim().isLength({ min: 5 }).withMessage('Title must be minimum of 5'),
    check('imageUrl').trim().notEmpty().withMessage('ImageUrl is required'),
    check('price').trim().notEmpty().withMessage('Price is required'),
    check('description').trim().isLength({ min: 5 }).withMessage('Description must be minimum of 5'),
    check('imageUrl').isURL().withMessage('Image URL must be a valid URL'),
    check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    check('description').notEmpty().withMessage('Description is required'),
];

productRoutes.get('/products', authMiddleware, getProducts);
productRoutes.get('/products/:productId', authMiddleware, getProduct);
productRoutes.put('/products/:productId', authMiddleware, productCreationValidation, editProduct);
productRoutes.post('/products', authMiddleware, productCreationValidation, createProduct);
productRoutes.delete('/products/:productId', authMiddleware, deleteProduct);

export default productRoutes;