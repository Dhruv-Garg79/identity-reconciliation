type Function = (data: object, statusCode?: number) => Send<ResBody, this>;

declare namespace Express {
	export interface Response {
		sendSuccess: Function;
		sendClientError: Function;
		sendServerError: Function;
	}
}
