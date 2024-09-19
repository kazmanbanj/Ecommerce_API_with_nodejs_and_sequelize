import { Response } from 'express';
import { ValidationError } from 'express-validator';
import HttpStatus from './http-status';
import ResponseModel from '../domain/response';

interface Errors {
    array: () => ValidationError[];
}

export const errorsForRequest = async (res: Response, errors: Errors): Promise<void> => {
    res.status(HttpStatus.VALIDATION_FAILED.code)
        .send(new ResponseModel(
            HttpStatus.VALIDATION_FAILED.code,
            'Validation failed, entered data is incorrect',
            [],
            errors.array().map((err: ValidationError) => ({
                field: err.type === 'field' ? err.path || err.location || err.value : '',
                message: err.msg,
            }))
        ));
};