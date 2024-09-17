const express = require('express');
const feedController = require('../controllers/feed');
const { check } = require('express-validator');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post(
    '/post',
    // isAuth,
    [
        check('title').trim().isLength({ min: 5 }),
        check('content').trim().isLength({ min: 5 }),
    ],
    feedController.createPost
);

module.exports = router;