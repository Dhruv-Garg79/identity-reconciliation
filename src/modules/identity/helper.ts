import ContactsTable, { ContactType } from '../../models/contactsTable';
import { LinkPreference } from '../../types/enums/linkPreference';
import Logger from '../../utils/logger';
import Result from '../../utils/result';

export class Helper {
	private readonly logger = new Logger('Identity Helper');
	private readonly contactsTable: ContactsTable;

	constructor(contactsTable: ContactsTable) {
		this.contactsTable = contactsTable;
	}

	public findContacts = async (email: string, phoneNumber: string): Promise<Result<ContactType[]>> => {
		const contacts = await this.contactsTable.findContacts(email, phoneNumber);
		if (contacts.isError()) {
			this.logger.error('fetching contacts failed', contacts.error);
			return contacts;
		}

		// we know that all contacts are fetched since we know both email and phone number
		if (email && phoneNumber) return contacts;

		// if any of email or phone is null, we need to find all the linked contacts as well
		let primaryId: number = null;
		let linkId: number = null;
		contacts.value.forEach((contact: ContactType) => {
			if (contact.linkPrecedence === LinkPreference.primary) primaryId = contact.id;
			else linkId = contact.linkedId ?? linkId;
		});

		this.logger.debug({ primaryId, linkId });

		// if we have a primary contact, we need to fetch all the secondary contacts
		// if we have a linked contact, we need to fetch all the other linked account and the primary account
		const otherContacts = primaryId
			? await this.contactsTable.getByField('linkedId', primaryId)
			: await this.contactsTable.findContactsByIdAndLink(linkId);

		if (otherContacts.isError()) {
			this.logger.error('fetching other contacts failed', otherContacts.error);
			return otherContacts;
		}

		return new Result(this.getUniqueContacts([contacts.value, otherContacts.value]));
	};

	private getUniqueContacts = (arr: ContactType[][]) => {
		const set = new Set();
		const uniqueContacts = [];

		arr.forEach(contacts => {
			contacts.forEach(contact => {
				if (!set.has(contact.id)) {
					uniqueContacts.push(contact);
					set.add(contact.id);
				}
			});
		});

		return uniqueContacts;
	};
}
