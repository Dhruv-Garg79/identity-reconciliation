import postgres from 'postgres';
import { envConfig } from './envConfig';

const { host, port, db, username, password } = envConfig.postgres;

const sql = postgres(`postgres://${username}:${password}@${host}:${port}/${db}`, {
	max: 3,
	max_lifetime: 20 * 60,
	idle_timeout: 5,
	prepare: true,
});

export default sql;
