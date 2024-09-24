import { Request, Response, NextFunction } from 'express';
import ResponseModel from '../domain/response';
import logger from '../util/logger';
import User from '../entities/user.entity';
import HttpStatus from '../util/http-status';
import { validationResult } from 'express-validator';
import { paginateModel } from '../util/pagination';
import { errorsForRequest } from '../util/errors';
import { fetchAllUsers, fetchOneUser, removeUser, updateOneUser } from '../services/user.service';
import { Like } from 'typeorm';
import db from '../config/database.config';


export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const paginate = req.query.paginate || 'false';
    const { search } = req.query;
    let whereClause: any = [];

    let options = {
        relations: [
            // 'products',
            // 'carts'
            // {
            //     model: User,
            //     as: 'user',
            //     attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
            // },
        ],
    };

    if (search) {
        whereClause = [
            { firstName: Like(`%${search}%`) },
            { lastName: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
        ];
    }
    const queryOptions = {
        ...options,
        where: whereClause.length > 0 ? whereClause : undefined
    };

    if (paginate === 'true') {
        try {
            const products = await paginateModel(db.getRepository(User), req, queryOptions);
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Users retrieved`,
                    {
                        data: products.data,
                        meta: products.pagination,
                    }
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
    } else {
        try {
            const users = await fetchAllUsers(req, queryOptions)
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Users retrieved`,
                    users
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
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user profile...`);
    const userAssociation = {
        relations: [
            'products',
            'carts',
            // {
            //     model: User,
            //     as: 'user',
            //     attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
            // },
        ],
    };

    try {
        const user = await fetchOneUser(req, userAssociation);

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


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user profile...`);

    try {
        const user = await fetchOneUser(req);

        if (!user) {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new ResponseModel(
                HttpStatus.NOT_FOUND.code,
                `User not found`
            ));
        } else {
            removeUser(user)
            res.status(HttpStatus.OK.code)
            .send(new ResponseModel(
                HttpStatus.OK.code,
                `User deleted successfully`,
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

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, updating user profile...`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    try {
        const user = await fetchOneUser(req);

        if (!user) {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new ResponseModel(
                HttpStatus.NOT_FOUND.code,
                `User not found`
            ));
        } else {
            updateOneUser(req, user);
            res.status(HttpStatus.OK.code)
            .send(new ResponseModel(
                HttpStatus.OK.code,
                `User updated successfully`,
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