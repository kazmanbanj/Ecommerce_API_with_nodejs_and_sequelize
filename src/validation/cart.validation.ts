import { check } from "express-validator";
import { ValidationChain } from "express-validator";
import { validateProductIds } from "../services/product.service";

export const cartCreationValidation: ValidationChain[] = [
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