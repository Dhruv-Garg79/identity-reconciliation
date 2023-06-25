import { envConfig } from '../config/envConfig';

export default class Logger {
	private nameSpace: string;

	constructor(nameSpace: string) {
		this.nameSpace = nameSpace;
	}

	private readonly logPrefixes = {
		success: envConfig.isProd ? '' : '\x1b[32m',
		debug: '',
		info: envConfig.isProd ? '' : '\x1b[36m',
		warn: envConfig.isProd ? '' : '\x1b[33m',
		error: envConfig.isProd ? '' : '\x1b[31m',
	};

	public success(...optionalParams: any[]): void {
		console.log(this.logPrefixes['success'], `${this.nameSpace}: `, ...optionalParams);
	}

	public debug(...optionalParams: any[]): void {
		console.debug(`${this.nameSpace}: `, ...optionalParams);
	}

	public info(...optionalParams: any[]): void {
		console.info(this.logPrefixes['info'], `${this.nameSpace}: `, ...optionalParams);
	}

	public warn(...optionalParams: any[]): void {
		console.warn(this.logPrefixes['warn'], `${this.nameSpace}: `, ...optionalParams);
	}

	public error(...optionalParams: any[]): void {
		console.error(this.logPrefixes['error'], `${this.nameSpace}: `, ...optionalParams);
	}

	private reduceConsoleArgs(args: any[]) {
		const errorMsg = args.reduce(function (aggregated, curr) {
			return `${aggregated} + ' ' + ${curr}`;
		}, '');

		return errorMsg;
	}
}
