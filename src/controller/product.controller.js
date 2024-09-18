const database = require('../config/mysql.config');
const Response = require('../domain/response');
const logger = require('../util/logger');
const Product = require('../models/product');
const HttpStatus = require('../util/http-status');
const { validationResult } = require('express-validator');
const paginateModel = require('../util/pagination');


exports.createProduct = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}, creating product...`);
    const errors = validationResult(req);
    const { title, imageUrl, price, description } = req.body;

    if (!errors.isEmpty()) {
        logger.error(errors);
        return res.status(HttpStatus.VALIDATION_FAILED.code)
            .send(new Response(
                HttpStatus.VALIDATION_FAILED.code,
                'Validation failed, entered data is incorrect',
                [],
                errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
                }))
            )
        );
    }

    Product.create({title, imageUrl, price, description})
    .then(result => {
        logger.info(result);
        res.status(HttpStatus.CREATED.code)
            .send(new Response(
                HttpStatus.CREATED.code,
                `Product created`,
                result
            )
        );
    })
    .catch(err => {
        logger.error(err.message);
    });
};

exports.getProducts = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const paginate = req.query.paginate || 'false';
    const limit = parseInt(req.query.limit) || 2;

    if (paginate === 'true') {
        try {
            const posts = await paginateModel(Product, page, limit, req.originalUrl);
            res.status(HttpStatus.OK.code)
                .send(new Response(
                    HttpStatus.OK.code,
                    `Posts retrieved`,
                    {
                        data: posts.data,
                        meta: posts.pagination
                    }
                )
            );
        } catch (err) {
            logger.error(err.message);

            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    `Error occurred`
                )
            );
            next(err);
        }

    } else {

        Product.findAll()
        .then(posts => {
            res.status(HttpStatus.OK.code)
                .send(new Response(
                    HttpStatus.OK.code,
                    `Posts retrieved`,
                    posts
                )
            );
        })
        .catch(err => {
            logger.error(err.message);

            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    `Error occurred`
                )
            );
            next(err);
        });
    }
};


exports.getProduct = async (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching product...`);

    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(
                    HttpStatus.NOT_FOUND.code,
                    `Product by id ${productId} was not found`
                )
            );
        } else {
            res.status(HttpStatus.OK.code)
                .send(new Response(
                    HttpStatus.OK.code,
                    `Product retrieved`,
                    product
                )
            );
        }
    } catch (err) {

        logger.error(err.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                `Error occurred`
            )
        );
        next(err);
    };
};





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