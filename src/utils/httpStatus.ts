export enum HttpStatus {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
	UN_AUTHORIZED = 401,
	REDIRECTION = 302,
	INTERNAL_SERVER_ERROR = 500,
	CONFLICT = 409,
}

export namespace HttpStatus {
	export function getDefaultMessage(code: HttpStatus): string {
		switch (code) {
			case HttpStatus.SUCCESS:
				return 'Successful Request';
			case HttpStatus.BAD_REQUEST:
				return 'Invalid Request';
			case HttpStatus.NOT_FOUND:
				return 'Not Found';
			case HttpStatus.UN_AUTHORIZED:
				return 'Unauthorized Request';
			case HttpStatus.REDIRECTION:
				return 'Redirecting Request';
			case HttpStatus.INTERNAL_SERVER_ERROR:
				return 'Internal Server Error';
			default:
				return 'Invalid Request';
		}
	}
}
