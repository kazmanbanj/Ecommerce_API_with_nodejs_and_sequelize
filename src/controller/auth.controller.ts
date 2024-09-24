import { Request, Response, NextFunction } from 'express';
import ResponseModel from '../domain/response';
import logger from '../util/logger';
import HttpStatus from '../util/http-status';
import { validationResult } from 'express-validator';
import { paginateModel } from '../util/pagination';
import { errorsForRequest } from '../util/errors';
import bcrypt from 'bcryptjs';
import User from '../entities/user.entity';
import { createUser } from '../services/user.service';
import { getToken } from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, creating user...`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    try {
        const result = await createUser(req);
        logger.info(result);
        res.status(HttpStatus.CREATED.code)
            .send(new ResponseModel(
                HttpStatus.CREATED.code,
                `User created`,
                result
            ));
    } catch (err) {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseModel(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            `Error occurred`
        ));
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, logging user in...`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new ResponseModel(
                HttpStatus.NOT_FOUND.code,
                `Invalid credentials`
            ));
        } else {
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword) {
                res.status(HttpStatus.VALIDATION_FAILED.code)
                .send(new ResponseModel(
                    HttpStatus.VALIDATION_FAILED.code,
                    `Invalid credentials`
                ));
            } else {
                const token = await getToken(user);

                res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `User logged in successfully`,
                    {
                        token,
                        user
                    }
                ));
            }
        }
    } catch (err) {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseModel(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            `Error occurred`
        ));
        next(err);
    }
};


export const profile = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user profile...`);
    const userId = Number(req.userId);

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new ResponseModel(
                HttpStatus.NOT_FOUND.code,
                `User not found`
            ));
        } else {
            res.status(HttpStatus.OK.code)
            .send(new ResponseModel(
                HttpStatus.OK.code,
                `User retrieved successfully`,
                user
            ));
        }
    } catch (err) {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseModel(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            `Error occurred`
        ));
        next(err);
    }
};
