import express from 'express';
import { getUsers, getUser, deleteUser, updateUser } from '../controller/user.controller';
import authMiddleware from '../middleware/is-auth'
import { updateUserValidation } from '../validation/user.validation';

const userRoutes = express.Router();

userRoutes.get('/', authMiddleware, getUsers);
userRoutes.get('/:id', authMiddleware, getUser);
userRoutes.delete('/:id', authMiddleware, deleteUser);
userRoutes.put('/:id', authMiddleware, updateUserValidation, updateUser);

export default userRoutes;