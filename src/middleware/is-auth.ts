import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../util/logger'
import HttpStatus from '../util/http-status';
import ResponseModel from '../domain/response';
import User from '../entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            userId?: string; // Optional userId property
        }
    }
}

// Define a type for the decoded token
interface DecodedToken {
    userId: string; // Ensure this matches what you're encoding
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(HttpStatus.UNAUTHORIZED.code)
        .send(new ResponseModel(
            HttpStatus.UNAUTHORIZED.code,
            `Unauthorized`
        ));
    }

    const token = authHeader.split(' ')[1] ?? null;
    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED.code)
        .send(new ResponseModel(
            HttpStatus.UNAUTHORIZED.code,
            `Unauthorized`
        ));
    }

    let decodedToken: DecodedToken | null;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch (err) {
        logger.error(err);
        return res.status(HttpStatus.UNAUTHORIZED.code)
        .send(new ResponseModel(
            HttpStatus.UNAUTHORIZED.code,
            `Unauthorized`
        ));
    }

    if (!decodedToken) {
        return res.status(HttpStatus.UNAUTHORIZED.code)
        .send(new ResponseModel(
            HttpStatus.UNAUTHORIZED.code,
            `Unauthorized`
        ));
    }

    const loggedInUserId: any = decodedToken.userId;
    const user = await User.findOne({ where: { id: loggedInUserId } });
    if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED.code)
        .send(new ResponseModel(
            HttpStatus.UNAUTHORIZED.code,
            `Unauthorized`
        ));
    }
    req.userId = decodedToken.userId;

    next();
};

export default authMiddleware;
