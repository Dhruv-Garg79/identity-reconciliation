import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import controller from './controller';
import validation from './validation';

const identifyRoutes = Router();

identifyRoutes.get('/identify', validate(validation.identify), controller.identify);

export default identifyRoutes;
