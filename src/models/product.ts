import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/mysql.config';
import User from './user';

// Define the attributes of the Product model
interface ProductAttributes {
    id: number;
    title?: string;
    price: number;
    imageUrl: string;
    description: string;
}

// Define the creation attributes (without 'id')
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public title?: string;
    public price!: number;
    public imageUrl!: string;
    public description!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the Product model
Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'products',
    }
);

export default Product;
