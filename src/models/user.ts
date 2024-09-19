import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/mysql.config';
import Product from './product';

// Define the attributes of the User model
interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone: string;
}

// Define the creation attributes (without 'id')
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public phone!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public toJSON(): Partial<UserAttributes> {
        const values = { ...this.get() }; // Get all instance values
        delete values.password; // Remove the password field
        return values; // Return the modified object
    }
}

// Initialize the User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
