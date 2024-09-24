import User from '../entities/user.entity';
import { Request, Response, NextFunction } from 'express';
import Product from '../entities/product.entity';
import { In } from 'typeorm';
import Cart from '../entities/cart.entity';
import db from '../config/database.config';
import log from '../util/logger';

interface ValidationResult {
    isValid: boolean;
    invalidIds: number[];
}

export const createOneProduct = async (req: Request) => {
    const userId: any = req.userId;
    const user = await User.findOne({ where:{id: userId} });
    const { title, imageUrl, price, description } = req.body;
    const product = await Product.create({ title, price, imageUrl, description });
    if (user) {
        product.user = user;
    }

    product.save();

    return product;
};

export const fetchOneProduct = async (req: Request, options: any = {}) => {
    const prodId = Number(req.params.id);
    return await Product.findOne({ where: { id: prodId }, ...options });
};

export const updateOneProduct = async (req: Request, product: Product) => {
    const userId: any = req.userId;
    const user = await User.findOne({ where: { id: userId } });
    const { title, imageUrl, price, description } = req.body;

    product.title = title || product.title;
    product.imageUrl = imageUrl || product.imageUrl;
    product.price = price || product.price;
    product.description = description || product.description;

    if (user) {
        product.user = user;
    }

    await product.save();

    return product;
};

export const validateProductIds = async (productIds: number[]): Promise<ValidationResult> => {
    const productRepository = db.getRepository(Product);
    const products = await productRepository.findBy({ id: In(productIds) });
    const existingIds = products.map(product => product.id);
    const invalidIds = productIds.filter(id => !existingIds.includes(id));

    return {
        isValid: invalidIds.length === 0,
        invalidIds,
    };
}

export const createOneCart = async (req: Request) => {
    const userId: any = Number(req.userId);
    const productIds: any = Number(req.body.productIds);
    log.info(req);
    const cartRepository = db.getRepository(Cart);
    const userRepository = db.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
        throw new Error('User not found');
    }

    const cart = new Cart();
    cart.user = user; // Associate the cart with the user

    // Save the cart
    return await cartRepository.save(cart);
};