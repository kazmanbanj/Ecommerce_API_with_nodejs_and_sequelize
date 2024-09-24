import bcrypt from 'bcryptjs';
import User from '../entities/user.entity';
import { Request, Response, NextFunction } from 'express';
import { Like } from 'typeorm';
import sendSignupEmail from '../mail/mailer';
import db from '../config/database.config';

export const createUser = async (req: Request) => {

    const { firstName, lastName, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    sendSignupEmail(email, 'Welcome to our website!', firstName);
    return await User.save({ firstName, lastName, email, password: hashedPassword, phone });
};


export const fetchAllUsers = async (req: Request, options: any) => {

    const { search } = req.query;
    const userRepository = db.getRepository(User);
    let queryOptions = { ...options };

    if (search) {
        queryOptions = {
            ...queryOptions,
            where: [
                { firstName: Like(`%${search}%`) },
                { lastName: Like(`%${search}%`) },
                { email: Like(`%${search}%`) },
            ],
        };
    }

    const users = await userRepository.find(queryOptions);
    return users;
};

export const fetchOneUser = async (req: Request, options: any = {}) => {
    const userId = Number(req.params.id);
    return await User.findOne({ where: { id: userId }, ...options });
};

export const removeUser = async (user: User) => {
    return await user.remove();
};

export const updateOneUser = async (req: Request, user: User) => {

    const { firstName, lastName, email, phone } = req.body;

    return await User.update({
            id: user.id
        },{
            firstName, lastName, phone
        });
};