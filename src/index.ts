import express from 'express';
import ip from 'ip';
import dotenv from "dotenv";
import cors from "cors";
import Response from './domain/response';
import HttpStatus from './util/http-status';
import logger from './util/logger';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
import db from './config/database.config';
import userRoutes from './routes/user.route';
import cartRoutes from './routes/cart.route';

dotenv.config();
const PORT = process.env.APP_PORT || 3000;

const app = express();

app.use(cors({origin: '*'}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());

app.use('/api/v1/admin', productRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => res.send(
    new Response(
        HttpStatus.OK.code,
        'Records API, v1.0.0 - All systems good to go'
    )
));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code).send(
    new Response(
        HttpStatus.NOT_FOUND.code,
        'Route doesn\'t exists on the server'
    )
));

db
.initialize()
.then(result => {
    // logger.info(result);
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${ip.address()}:${PORT}`);
    });
})
.catch(err => logger.error(err));
