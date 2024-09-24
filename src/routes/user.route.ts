import express from 'express';
import { getUsers, getUser, deleteUser, updateUser } from '../controller/user.controller';
import authMiddleware from '../middleware/is-auth'
import { check, ValidationChain } from 'express-validator';
import User from '../entities/user.entity';

const userRoutes = express.Router();

const updateUserValidation: ValidationChain[] = [
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

    check('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required'),
];

userRoutes.get('/', authMiddleware, getUsers);
userRoutes.get('/:id', authMiddleware, getUser);
userRoutes.delete('/:id', authMiddleware, deleteUser);
userRoutes.put('/:id', authMiddleware, updateUserValidation, updateUser);

export default userRoutes;