import express from 'express';
import { createCart } from '../controller/cart.controller';
import { check, ValidationChain } from 'express-validator';
import authMiddleware from '../middleware/is-auth';
import { validateProductIds } from '../services/product.service';

const cartRoutes = express.Router();

const cartCreationValidation: ValidationChain[] = [
    check('productIds')
        .notEmpty()
        .withMessage('Product is required')
        .custom(async (value) => {
            const productIdsToValidate: number[] = value;
            const result = await validateProductIds(productIdsToValidate)
            if (!result.isValid) {
                console.log('Invalid product IDs:', result.invalidIds);
                return Promise.reject('Invalid product');
            }
        })
];

cartRoutes.post('/', authMiddleware, cartCreationValidation, createCart);
// cartRoutes.get('/products', authMiddleware, getProducts);
// cartRoutes.get('/products/:id', authMiddleware, getProduct);
// cartRoutes.put('/products/:id', authMiddleware, productCreationValidation, editProduct);
// cartRoutes.delete('/products/:id', authMiddleware, deleteProduct);

export default cartRoutes;