export default class Errors {
	static DOES_NOT_EXIST = 'Doc does not exist';
}

export const errorHandler = (err, _req, res, _next) => {
	const { message } = err;
	const response = {
		message,
	};

	res.sendServerError(response);
};
