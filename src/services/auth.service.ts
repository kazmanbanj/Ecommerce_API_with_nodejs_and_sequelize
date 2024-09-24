import jwt from 'jsonwebtoken';
import User from '../entities/user.entity';

export const getToken = async (user: User) => {

    return await jwt.sign(
        {
            email: user.email,
            userId: user.id.toString()
        },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.TOKEN_EXPIRES_IN as string }
    );
};
