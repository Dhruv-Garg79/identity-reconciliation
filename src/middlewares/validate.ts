import { SafeParseError, SafeParseReturnType, Schema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

const logger = new Logger('validation middleware');

export const validate = (schema: Schema<object>) => async (req: Request, res: Response, next: NextFunction) => {
	const validateRes: SafeParseReturnType<object, any> = schema.safeParse(req);

	if (!validateRes.success) {
		const failResult = validateRes as SafeParseError<any>;
		logger.error('validation failed', JSON.parse(failResult.error.message));
		return res.sendClientError({
			message: 'validation failed',
			data: failResult.error.errors,
		});
	}

	if (validateRes.data.body) req.body = validateRes.data.body;
	if (validateRes.data.query) req.query = validateRes.data.query;

	next();
};
