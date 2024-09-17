import express from 'express';
import ip from "ip";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import Response from './domain/response.js';
import HttpStatus from './controller/patient.controller.js';
import logger from './util/logger.js';
import patientRoutes from './routes/patient.route.js';

dotenv.config();
const PORT = process.env.DB_PORT || 3000;

const app = express();

app.use(bodyParser.json());

// app.use(cors({origin: '*}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());

app.use('/patients', patientRoutes);
app.get('/', (req, res) => res.send(
    new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.status,
        'Patient API, v1.0.0 - All systems go'
    )
));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code).send(
    new Response(
        HttpStatus.NOT_FOUND.code,
        HttpStatus.NOT_FOUND.status,
        'Route doesn\'t exists on the server'
    )
));

app.listen(PORT, () => {
    logger.info(`Server is running on port ${ip.address()}:${PORT}`);
});
