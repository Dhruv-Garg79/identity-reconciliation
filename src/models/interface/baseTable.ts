import { SafeParseError, SafeParseReturnType } from 'zod/lib/types';
import sql from '../../config/postgres';
import Logger from '../../utils/logger';
import Result from '../../utils/result';

export type SortOrder = 'asc' | 'desc';
type Operators = '=' | '>' | '<' | '>=' | '<=' | '!=';
type ValueTypes = string | number | Date;
type Filter<T> = {
	[field in keyof T]: ValueTypes;
};

export type PaginatedParams<T> = {
	field: keyof T;
	value: ValueTypes;
	order: { by: keyof T; order: SortOrder };
	limit: number;
	offset: number;
};

export type FixedPaginatedParams<T> = {
	value: ValueTypes;
	order: { by: keyof T; order: SortOrder };
	limit: number;
	offset: number;
};

export default abstract class BaseTable<T> {
	protected readonly logger: Logger;
	protected tableName: string;
	protected primaryKey: string;

	constructor(table: string, pk?: string) {
		this.tableName = table;
		this.primaryKey = pk ?? 'id';
		this.logger = new Logger(`${table}-model`);
	}

	protected handleValidateFailure(result: SafeParseReturnType<any, any>, input: T): Result<any> {
		const failResult = result as SafeParseError<T>;
		this.logger.error('validation error for input', input, 'error', failResult.error);
		return Result.error('validation failed');
	}

	public async getByPk(id: number): Promise<Result<T>> {
		try {
			const res = await sql`select * from ${sql(this.tableName)} where ${sql(this.primaryKey)} = ${id}`;
			return new Result(res[0] as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getByField(field: keyof T, value: ValueTypes): Promise<Result<T[]>> {
		try {
			const res = await sql`select * from ${sql(this.tableName)} where ${sql(field as any)} = ${value}`;
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getCountByField(field: keyof T, value: ValueTypes): Promise<Result<number>> {
		try {
			const res = await sql`select count(*) as count from ${sql(this.tableName)} where ${sql(field as any)} = ${value}`;
			return new Result(res[0].count as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getWhereFieldNot(field: keyof T, value: ValueTypes): Promise<Result<T[]>> {
		try {
			const res = await sql`select * from ${sql(this.tableName)} where ${sql(field as any)} != ${value}`;
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getByPaginated(param: PaginatedParams<T>): Promise<Result<T[]>> {
		try {
			if (param.order.order === 'asc') {
				const res = await sql`select * from ${sql(this.tableName)} where ${sql(param.field as any)} = ${
					param.value
				} order by ${sql(param.order.by as any)} asc offset ${param.offset} limit ${param.limit}`;
				return new Result(res as any);
			} else {
				const res = await sql`select * from ${sql(this.tableName)} where ${sql(param.field as any)} = ${
					param.value
				} order by ${sql(param.order.by as any)} desc offset ${param.offset} limit ${param.limit}`;
				return new Result(res as any);
			}
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getAll(): Promise<Result<T[]>> {
		try {
			const res = await sql`select * from ${sql(this.tableName)}`;
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async insert(data: T): Promise<Result<T>> {
		try {
			const res = await sql`insert into ${sql(this.tableName)} ${sql(data as any, ...Object.keys(data))} RETURNING *`;
			return new Result(res[0] as T);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async insertMany(data: T[]): Promise<Result<Array<T>>> {
		try {
			if (data.length === 0) return Result.error('nothing to insert');

			const res = await sql`insert into ${sql(this.tableName)} ${sql(
				data as any,
				...Object.keys(data[0]),
			)} on conflict do nothing RETURNING *`;

			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async insertManyDoNothingOnConflict(data: T[], key: keyof T): Promise<Result<Array<T>>> {
		try {
			if (data.length === 0) return Result.error('nothing to insert');

			const res = await sql`insert into ${sql(this.tableName)} ${sql(
				data as any,
				...Object.keys(data[0]),
			)} on conflict(${sql(key as any)}) do nothing`;

			return new Result(res as any);
		} catch (error) {
			this.logger.error(error, 'input', data);
			return Result.error(error.message);
		}
	}

	public async updateByPk(id: string | number, data: T): Promise<Result<T>> {
		try {
			(data as any).updated_at = new Date();
			const res = await sql`update ${sql(this.tableName)} set ${sql(data as any, ...Object.keys(data))} where ${sql(
				this.primaryKey,
			)} = ${id} RETURNING *`;
			return new Result(res[0] as T);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async updateByField(field: keyof T, value: ValueTypes, data: T): Promise<Result<Array<T>>> {
		try {
			(data as any).updated_at = new Date();
			const res = await sql`update ${sql(this.tableName)} set ${sql(data as any, ...Object.keys(data))} where ${sql(
				field as any,
			)} = ${value} RETURNING *`;
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async deleteByPk(id: string): Promise<Result<any>> {
		try {
			const res = await sql`delete from ${sql(this.tableName)} where ${sql(this.primaryKey)} = ${id} RETURNING *`;
			return new Result(res[0]);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}
}
