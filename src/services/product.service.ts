import User from '../entities/user.entity';
import { Request, Response, NextFunction } from 'express';
import Product from '../entities/product.entity';


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