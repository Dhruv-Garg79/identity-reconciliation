import compression from 'compression';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import identifyRoutes from '../modules/identity/routes';
import { errorHandler } from '../utils/errors';
import { HttpStatus } from '../utils/httpStatus';
import Result from '../utils/result';

const app: Express = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

app.use(morgan('dev'));

app.use((_req, res, next) => {
	res.sendSuccess = (data: object) => res.status(HttpStatus.SUCCESS).send(data);
	res.sendClientError = (message: string, data?: object, statusCode = HttpStatus.BAD_REQUEST) =>
		res.status(statusCode).send({ message, data });
	res.sendServerError = (message: string, data?: object, statusCode = HttpStatus.BAD_REQUEST) =>
		res.status(statusCode).send({ message, data });

	next();
});

// v1 api routes
app.use('/v1', identifyRoutes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
	next(Result.error('Not found', HttpStatus.NOT_FOUND));
});

app.use(errorHandler);

export default app;
