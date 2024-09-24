import { Request, Response, NextFunction } from 'express';
import ResponseModel from '../domain/response';
import logger from '../util/logger';
import Product from '../entities/product.entity';
import HttpStatus from '../util/http-status';
import { validationResult } from 'express-validator';
import { paginateModel } from '../util/pagination';
import { errorsForRequest } from '../util/errors';
import { createOneProduct, fetchOneProduct, updateOneProduct, createOneCart } from '../services/product.service';
import { Like } from 'typeorm';
import db from '../config/database.config';


export const createCart = async (req: Request, res: Response, next: NextFunction) => {

    logger.info(`${req.method} ${req.originalUrl}, adding product to cart...`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    try {
        const result = await createOneCart(req);
        logger.info(result);
        res.status(HttpStatus.CREATED.code)
        .send(new ResponseModel(
            HttpStatus.CREATED.code,
            `Cart created`,
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

// export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
//     const paginate = req.query.paginate || 'false';
//     const { search } = req.query;
//     let whereClause: any = [];

//     let options = {
//         relations: [
//             'user'
//             // {
//             //     model: User,
//             //     as: 'user',
//             //     attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
//             // },
//         ],
//     };

//     if (search) {
//         whereClause = [
//             { title: Like(`%${search}%`) },
//             { price: Like(`%${search}%`) },
//             { imageUrl: Like(`%${search}%`) },
//             { description: Like(`%${search}%`) },
//         ];
//     }
//     const queryOptions = {
//         ...options,
//         where: whereClause.length > 0 ? whereClause : undefined
//     };

//     try {
//         if (paginate === 'true') {
//             const products = await paginateModel(db.getRepository(Product), req, queryOptions);
//             res.status(HttpStatus.OK.code)
//                 .send(new ResponseModel(
//                     HttpStatus.OK.code,
//                     `Products retrieved`,
//                     {
//                         data: products.data,
//                         meta: products.pagination,
//                     }
//                 ));
//         } else {
//             const products = await Product.find(queryOptions);
//             res.status(HttpStatus.OK.code)
//                 .send(new ResponseModel(
//                     HttpStatus.OK.code,
//                     `Products retrieved`,
//                     products
//                 ));
//         }
//     } catch (err) {
//         logger.error(err);
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//             .send(new ResponseModel(
//                 HttpStatus.INTERNAL_SERVER_ERROR.code,
//                 `Error occurred`
//             ));
//         next(err);
//     }
// };

// export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching product...`);

//     try {
//         const productId: any = Number(req.params.id);
//         const product = await Product.findOne({
//             where: { id: productId },
//             relations: [
//                 'user'
//                 // {
//                 //     model: User,
//                 //     as: 'user',
//                 //     attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
//                 // },
//             ]
//         });
//         if (!product) {
//             res.status(HttpStatus.NOT_FOUND.code)
//                 .send(new ResponseModel(
//                     HttpStatus.NOT_FOUND.code,
//                     `Product by id ${productId} was not found`
//                 ));
//         } else {
//             res.status(HttpStatus.OK.code)
//                 .send(new ResponseModel(
//                     HttpStatus.OK.code,
//                     `Product retrieved`,
//                     product
//                 ));
//         }
//     } catch (err) {
//         logger.error(err);
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//             .send(new ResponseModel(
//                 HttpStatus.INTERNAL_SERVER_ERROR.code,
//                 `Error occurred`
//             ));
//         next(err);
//     }
// };

// export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
//     logger.info(`${req.method} ${req.originalUrl}, updating product...`);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         logger.error(errors);
//         return errorsForRequest(res, errors);
//     }

//     try {
//         const product = await fetchOneProduct(req);
//         if (!product) {
//             res.status(HttpStatus.NOT_FOUND.code)
//                 .send(new ResponseModel(
//                     HttpStatus.NOT_FOUND.code,
//                     `Product not found`
//                 ));
//         } else {
//             updateOneProduct(req, product);
//             res.status(HttpStatus.OK.code)
//                 .send(new ResponseModel(
//                     HttpStatus.OK.code,
//                     `Product updated`,
//                     product
//                 ));
//         }
//     } catch (err) {
//         logger.error(err);
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//             .send(new ResponseModel(
//                 HttpStatus.INTERNAL_SERVER_ERROR.code,
//                 `Error occurred`
//             ));
//         next(err);
//     }
// };

// export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
//     logger.info(`${req.method} ${req.originalUrl}, deleting product...`);
//     try {
//         const productId: any = Number(req.params.id);
//         const product = await Product.findOne({ where: { id: productId } });
//         if (!product) {
//             res.status(HttpStatus.NOT_FOUND.code)
//                 .send(new ResponseModel(
//                     HttpStatus.NOT_FOUND.code,
//                     `Product by id ${productId} was not found`
//                 ));
//         } else {
//             await product.remove();
//             res.status(HttpStatus.OK.code)
//                 .send(new ResponseModel(
//                     HttpStatus.OK.code,
//                     `Product deleted`,
//                     product
//                 ));
//         }
//     } catch (err) {
//         logger.error(err);
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//             .send(new ResponseModel(
//                 HttpStatus.INTERNAL_SERVER_ERROR.code,
//                 `Error occurred`
//             ));
//         next(err);
//     }
// };
