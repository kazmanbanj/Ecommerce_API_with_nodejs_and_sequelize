import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const db = new DataSource({
    type: 'mysql',  // or 'postgres', 'sqlite', etc.
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: [
        "src/entities/*.entity.ts"
    ]
});

export default db;