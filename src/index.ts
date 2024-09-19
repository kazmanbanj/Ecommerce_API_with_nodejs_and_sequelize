import express from 'express';
import ip from 'ip';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import Response from './domain/response';
import HttpStatus from './util/http-status';
import logger from './util/logger';
import productRoutes from './routes/product.route';
import sequelize from './config/mysql.config';
import Product from './models/product';
import User from './models/user';
import authRoutes from './routes/auth.route';

dotenv.config();
const PORT = process.env.DB_PORT || 3000;

const app = express();

app.use(cors({origin: '*'}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());

app.use('/admin', productRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send(
    new Response(
        HttpStatus.OK.code,
        'Patient API, v1.0.0 - All systems go'
    )
));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code).send(
    new Response(
        HttpStatus.NOT_FOUND.code,
        'Route doesn\'t exists on the server'
    )
));
app.use((req, res, next) => {
    const user = User.findOne({ where: { id: req.userId } });
});
app.use(bodyParser.json());

// // relationships
// Product.belongsTo(User, {
//     constraints: true,
//     onDelete: 'CASCADE'
// });
// User.hasMany(Product);


sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        // logger.info(result);
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${ip.address()}:${PORT}`);
        });
    })
    .catch(err => logger.info(err));
