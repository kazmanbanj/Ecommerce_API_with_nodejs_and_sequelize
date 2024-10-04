import { check } from "express-validator";
import { ValidationChain } from "express-validator";

export const productCreationValidation: ValidationChain[] = [
    check('title').trim().isLength({ min: 5 }).withMessage('Title must be minimum of 5'),
    check('imageUrl').trim().notEmpty().withMessage('ImageUrl is required'),
    check('price').trim().notEmpty().withMessage('Price is required'),
    check('description').trim().isLength({ min: 5 }).withMessage('Description must be minimum of 5'),
    check('imageUrl').isURL().withMessage('Image URL must be a valid URL'),
    check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    check('description').notEmpty().withMessage('Description is required'),
];