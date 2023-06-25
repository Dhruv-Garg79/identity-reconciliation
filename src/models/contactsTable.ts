import { z } from 'zod';
import { LinkPreference } from '../types/enums/linkPreference';
import BaseTable from './interface/baseTable';

export type ContactType = z.infer<typeof ContactsTable.schema>;

export default class ContactsTable extends BaseTable<ContactType> {
	constructor() {
		super('contacts');
	}

	static readonly schema = z.object({
		id: z.number(),
		phoneNumber: z.string().optional(),
		email: z.string().optional(),
		linkedId: z.number().optional(),
		linkPrecedence: z.nativeEnum(LinkPreference),
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.date().optional(),
	});
}
