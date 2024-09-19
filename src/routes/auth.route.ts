import express from 'express';
import { signup, login } from '../controller/auth.controller';
import { check, ValidationChain} from 'express-validator';
import User from '../models/user';

const authRoutes = express.Router();

const signupValidation: ValidationChain[] = [
    check('firstName')
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('First name is required and must be a minimum of 5 characters'),

    check('lastName')
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('Last name is required and must be a minimum of 5 characters'),

    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email is required')
        .custom(async (value) => {
            const user = await User.findOne({ where: { email: value } });
            if (user) {
                return Promise.reject('Email address already exists!');
            }
        })
        .normalizeEmail(),

    check('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be a minimum of 8 characters'),

    check('passwordConfirmation').custom((value, { req }) => {
        return value === req.body.password;
    })
    .notEmpty()
    .withMessage('Password confirmation must match'),

    check('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required'),
];

const loginValidation: ValidationChain[] = [
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email is required')
        .normalizeEmail(),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
];


authRoutes.post('/signup', signupValidation, signup);
authRoutes.post('/login', loginValidation, login);

// authRoutes.put('/signup', getProducts);
// authRoutes.get('/products/:productId', getProduct);
// authRoutes.post(
//     '/products',
//     [
//         check('title').trim().isLength({ min: 5 }).withMessage('Title must be minimum of 5'),
//         check('imageUrl').trim().notEmpty().withMessage('ImageUrl is required'),
//         check('price').trim().notEmpty().withMessage('Price is required'),
//         check('description').trim().isLength({ min: 5 }).withMessage('Description must be minimum of 5'),
//         check('imageUrl').isURL().withMessage('Image URL must be a valid URL'),
//         check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
//         check('description').notEmpty().withMessage('Description is required'),
//     ],
//     createProduct
// );

// authRoutes.delete('/products/:productId', deleteProduct);


export default authRoutes;