const express = require('express');
const ip = require("ip");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require("cors");
const Response = require('./domain/response');
const HttpStatus = require('./util/http-status');
const logger = require('./util/logger');
const productRoutes = require('./routes/product.route');
const sequelize = require('./config/mysql.config');

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
app.use(bodyParser.json());

sequelize
    // .sync({force: true})
    .sync()
    // .then(result => {
    //     return User.findByPk(1);
    // })
    // .then(user => {
    //     if (!user) {
    //         return User.create({name: 'John Doe', email: 'johndoe@email.com'});
    //     }
    //     return user;
    // })
    // .then(user => {
        // console.log(user);
    //     user.createCart();
    // })
    .then(result => {
        // logger.info(result);
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${ip.address()}:${PORT}`);
        });
    })
    .catch(err => logger.info(err));
