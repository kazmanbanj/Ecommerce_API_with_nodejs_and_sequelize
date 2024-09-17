const { validationResult } = require('express-validator');


exports.getPosts = (req, res, next) => {
    res.json({
        posts: [{
            title: 'first title'
        }]
    });
};

exports.createPost = (req, res, next) => {
    // validating request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: 'Post created successfully',
        posts: [{
            title: title,
            content: content,
        }]
    });
};