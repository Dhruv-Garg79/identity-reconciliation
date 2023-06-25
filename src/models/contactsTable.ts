import { z } from 'zod';
import sql from '../config/postgres';
import { LinkPreference } from '../types/enums/linkPreference';
import Result from '../utils/result';
import BaseTable from './interface/baseTable';

export type ContactType = z.infer<typeof ContactsTable.schema>;

export default class ContactsTable extends BaseTable<ContactType> {
	constructor() {
		super('contacts');
	}

	static readonly schema = z.object({
		id: z.number(),
		phoneNumber: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		linkedId: z.number().nullable().optional(),
		linkPrecedence: z.nativeEnum(LinkPreference),
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.date().nullable().optional(),
	});

	public findContacts = async (email: string, phoneNumber: string) => {
		try {
			let res;
			if (!phoneNumber) {
				res = await sql`select * from ${sql(this.tableName)} where "email" = ${email}`;
			} else if (!email) {
				res = await sql`select * from ${sql(this.tableName)} where "phoneNumber" = ${phoneNumber}`;
			} else {
				res = await sql`select * from ${sql(
					this.tableName,
				)} where "email" = ${email} or "phoneNumber" = ${phoneNumber}`;
			}
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	};

	public findContactsByIdAndLink = async (id: number) => {
		try {
			const res = await sql`select * from ${sql(this.tableName)} where id = ${id} or "linkedId" = ${id}`;
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	};

	public updateLinkPrecedenceToSecondary = async (ids: number[], primaryId: number) => {
		try {
			const res = await sql`update ${sql(
				this.tableName,
			)} set "linkedId" = ${primaryId}, "linkPrecedence" = 'secondary' where id = ANY(${ids})`;
			return new Result(res as any);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	};
}
