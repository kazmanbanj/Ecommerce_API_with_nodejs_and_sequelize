import { check } from "express-validator";
import { ValidationChain } from "express-validator";
import User from "../entities/user.entity";


export const signupValidation: ValidationChain[] = [
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

export const loginValidation: ValidationChain[] = [
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email is required')
        .normalizeEmail(),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
];