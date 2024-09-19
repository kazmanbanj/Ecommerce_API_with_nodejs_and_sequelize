import { Request, Response, NextFunction } from 'express';
import ResponseModel from '../domain/response';
import logger from '../util/logger';
import Product from '../models/product';
import User from '../models/user';
import HttpStatus from '../util/http-status';
import { validationResult } from 'express-validator';
import paginateModel from '../util/pagination';
import { errorsForRequest } from '../util/errors';

Product.associate({ User });

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, creating product...`);
    const errors = validationResult(req);

    const { title, imageUrl, price, description } = req.body;
    const userId = Number(req.userId);

    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    try {
        const result = await Product.create({ title, imageUrl, price, description, userId });
        logger.info(result);
        res.status(HttpStatus.CREATED.code)
            .send(new ResponseModel(
                HttpStatus.CREATED.code,
                `Product created`,
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

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const paginate = req.query.paginate || 'false';
    const limit = parseInt(req.query.limit as string) || 2;
    const userAssociation = {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
            },
        ],
    };

    if (paginate === 'true') {
        try {
            const products = await paginateModel(Product, page, limit, req.originalUrl, userAssociation);
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Products retrieved`,
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
            const products = await Product.findAll(userAssociation);
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Products retrieved`,
                    products
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

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching product...`);

    try {
        const productId = req.params.productId;
        const product = await Product.findOne({
            where: { id: productId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
                },
            ]
        });
        if (!product) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new ResponseModel(
                    HttpStatus.NOT_FOUND.code,
                    `Product by id ${productId} was not found`
                ));
        } else {
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Product retrieved`,
                    product
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

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, updating product...`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    const { title, imageUrl, price, description } = req.body;
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new ResponseModel(
                    HttpStatus.NOT_FOUND.code,
                    `Product by id ${productId} was not found`
                ));
        } else {
            product.update({ title, imageUrl, price, description });

            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Product updated`,
                    product
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, deleting product...`);
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new ResponseModel(
                    HttpStatus.NOT_FOUND.code,
                    `Product by id ${productId} was not found`
                ));
        } else {
            await product.destroy();
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Product deleted`,
                    product
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