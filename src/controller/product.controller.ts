import { Request, Response, NextFunction } from 'express';
import ResponseModel from '../domain/response';
import logger from '../util/logger';
import Product from '../models/product';
import HttpStatus from '../util/http-status';
import { validationResult } from 'express-validator';
import paginateModel from '../util/pagination';
import { errorsForRequest } from '../util/errors';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}, creating product...`);
    const errors = validationResult(req);

    const { title, imageUrl, price, description } = req.body;

    if (!errors.isEmpty()) {
        logger.error(errors);
        return errorsForRequest(res, errors);
    }

    try {
        const result = await Product.create({ title, imageUrl, price, description });
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

// const userWithPosts = await User.findByPk(user.id, { include: [Post] });
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const paginate = req.query.paginate || 'false';
    const limit = parseInt(req.query.limit as string) || 2;

    if (paginate === 'true') {
        try {
            const posts = await paginateModel(Product, page, limit, req.originalUrl);
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Posts retrieved`,
                    {
                        data: posts.data,
                        meta: posts.pagination,
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
            const posts = await Product.findAll();
            res.status(HttpStatus.OK.code)
                .send(new ResponseModel(
                    HttpStatus.OK.code,
                    `Posts retrieved`,
                    posts
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
        const product = await Product.findOne({ where: { id: productId } });
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




















































































































































































































































// raw sql
// export const getPatients = (req, res, next) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching patients...`);

//     database.query(QUERY.SELECT_PATIENTS, (error, results) => {
//         if (!results) {
//             res.status(HttpStatus.OK.code)
//                 .send(new Response(
//                     HttpStatus.OK.code,
//                     `No patients found`
//                 )
//             );
//         } else {
//             res.status(HttpStatus.OK.code)
//                 .send(new Response(
//                     HttpStatus.OK.code,
//                     `Patients retrieved`,
//                     {
//                         patients: results
//                     }
//                 )
//             );
//         }
//     });
// };



// export const getPatient = (req, res, next) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching patient...`);

//     database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
//         // if (!results) {
//         if (!results[0]) {
//             res.status(HttpStatus.NOT_FOUND.code)
//                 .send(new Response(
//                     HttpStatus.NOT_FOUND.code,
//                     `Patient by id ${req.params.id} was not found`
//                 )
//             );
//         } else {
//             res.status(HttpStatus.OK.code)
//                 .send(new Response(
//                     HttpStatus.OK.code,
//                     `Patient retrieved`,
//                     results[0]
//                 )
//             );
//         }
//     });
// };

// export const updatePatient = (req, res, next) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching patient...`);

//     database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
//         if (!results[0]) {
//             res.status(HttpStatus.NOT_FOUND.code)
//                 .send(new Response(
//                     HttpStatus.NOT_FOUND.code,
//                     `Patient by id ${req.params.id} was not found`
//                 )
//             );
//         } else {
//             logger.info(`${req.method} ${req.originalUrl}, updating patient...`);

//             database.query(QUERY.UPDATE_PATIENT, [...Object.values(req.body), req.params.id], (error, results) => {
//                 if (!error) {
//                     res.status(HttpStatus.OK.code)
//                     .send(new Response(
//                         HttpStatus.OK.code,
//                         `Patient updated`,
//                         {
//                             id: req.params.id,
//                             ...req.body
//                         }
//                     ));
//                 } else {
//                     logger.error(error.message);
//                     res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//                     .send(new Response(
//                         HttpStatus.INTERNAL_SERVER_ERROR.code,
//                         HttpStatus.INTERNAL_SERVER_ERROR
//                         `Error occurred`
//                     )
//                 );
//                 }
//             });
//         }
//     });
// };

// export const deletePatient = (req, res, next) => {
//     logger.info(`${req.method} ${req.originalUrl}, deleting patient...`);

//     database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
//         if (results.affectedRows > 0) {
//             res.status(HttpStatus.OK.code)
//                 .send(new Response(
//                     HttpStatus.OK.code,
//                     `Patient deleted`,
//                     results[0]
//                 )
//             );
//         } else {
//             res.status(HttpStatus.NOT_FOUND.code)
//                 .send(new Response(
//                     HttpStatus.NOT_FOUND.code,
//                     HttpStatus.NOT_FOUND
//                     `Patient by id ${req.params.id} was not found`
//                 )
//             );
//         }
//     });
// };


// module.exports = HttpStatus;