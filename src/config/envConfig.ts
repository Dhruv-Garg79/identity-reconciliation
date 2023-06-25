import * as dotenv from 'dotenv';
import path from 'path';

interface Config {
	readonly env: string;
	readonly isProd: boolean;
	readonly postgres: {
		host: string;
		port: number;
		db: string;
		username: string;
		password: string;
	};
}

const getEnvValue = (key: string): string => {
	return process.env[key] ?? '';
};

const env = getEnvValue('NODE_ENV');
const isProd = env === 'prod';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) });

export const envConfig: Config = {
	env: env,
	isProd: isProd,
	postgres: {
host: getEnvValue('POSTGRES_HOST'),
		port: parseInt(getEnvValue('POSTGRES_PORT')),
		db: getEnvValue('POSTGRES_DB_INSTANCE'),
		username: getEnvValue('POSTGRES_USERNAME'),
		password: getEnvValue('POSTGRES_PASSWORD'),
	},
};

if (!isProd) console.log(envConfig);
