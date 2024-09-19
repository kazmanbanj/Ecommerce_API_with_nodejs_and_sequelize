import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE as string, process.env.DB_USERNAME as string, process.env.DB_PASSWORD as string, {
    dialect: 'mysql',  // or 'postgres', 'sqlite', etc.
    host: process.env.DB_HOST as string
});

export default sequelize;
