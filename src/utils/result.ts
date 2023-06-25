import Errors from './errors';
import { HttpStatus } from './httpStatus';
import { Response } from 'express';

export default class Result<T> {
	error: string | null;
	value: T;
	statusCode: HttpStatus;

	constructor(value: T, error: string | null = null, statusCode?: HttpStatus) {
		this.value = value;
		this.error = error;
		this.statusCode = statusCode;
	}

	public isError(): boolean {
		return this.error ? true : false;
	}

	public isUnhandledError(): boolean {
		return this.error && this.error !== Errors.DOES_NOT_EXIST;
	}

	static error(error: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR): Result<any> {
		return new Result(null as any, error, statusCode);
	}

	public apiResponse(res: Response) {
		if (this.error) res.sendServerError({ message: this.error });

		res.sendSuccess({ message: 'Successful request', data: this.value });
	}

	public clientError(): object {
		return {
			message: this.error,
		};
	}
}
