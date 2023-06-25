import { NextFunction, Request, Response } from 'express';
import ContactsTable, { ContactType } from '../../models/contactsTable';
import { LinkPreference } from '../../types/enums/linkPreference';
import Logger from '../../utils/logger';
import { Helper } from './helper';

class Controller {
	private readonly logger = new Logger('Identity Controller');
	private readonly contactsTable = new ContactsTable();
	private readonly helper = new Helper(this.contactsTable);

	public identify = async (req: Request, res: Response, next: NextFunction) => {
		const { email, phoneNumber } = req.body;
		this.logger.debug('identify', email, phoneNumber);

		if (!email && !phoneNumber) {
			return res.sendClientError('email or phone number is required');
		}

		// find if there exists a contact with the given email or phone number
		const existing = await this.helper.findContacts(email, phoneNumber);
		if (existing.isError()) {
			this.logger.error('fetching existing contact failed', existing.error);
			return existing.apiResponse(res);
		}

		let emailExists = false;
		let phoneExists = false;

		const emails = new Set();
		const phoneNumbers = new Set();
		const secondaryContactIds = [];
		let primaryContact: ContactType = null;

		existing.value.forEach((contact: ContactType) => {
			if (contact.email === email) emailExists = true;
			if (contact.phoneNumber === phoneNumber) phoneExists = true;

			if (contact.linkPrecedence === LinkPreference.primary) {
				primaryContact = contact;
			} else {
				emails.add(contact.email);
				phoneNumbers.add(contact.phoneNumber);
				secondaryContactIds.push(contact.id);
			}
		});

		// create a new contact if email or does not match existing records is not found
		if ((!emailExists && email !== null) || (!phoneExists && phoneNumber !== null)) {
			const isPrimary = !emailExists && email !== null && !phoneExists && phoneNumber !== null;
			const contact = await this.contactsTable.insert({
				email: email,
				phoneNumber: phoneNumber,
				linkPrecedence: isPrimary ? LinkPreference.primary : LinkPreference.secondary, // if both email and phone number are new, then the new contact is primary
				linkedId: !isPrimary ? primaryContact.id : null,
			});

			if (contact.isError()) {
				this.logger.error('inserting new contact failed', contact.error);
				return contact.apiResponse(res);
			}

			if (contact.value.linkPrecedence === LinkPreference.primary) {
				primaryContact = contact.value;
			} else {
				secondaryContactIds.push(contact.value.id);
				emails.add(contact.value.email);
				phoneNumbers.add(contact.value.phoneNumber);
			}
		}

		emails.delete(primaryContact.email);
		phoneNumbers.delete(primaryContact.phoneNumber);
		return res.sendSuccess({
			contact: {
				primaryContatctId: primaryContact.id,
				emails: [primaryContact.email, ...emails], // first element being email of primary contact
				phoneNumbers: [primaryContact.phoneNumber, ...phoneNumbers], // first element being phoneNumber of primary contact
				secondaryContactIds: secondaryContactIds, // Array of all Contact IDs that are "secondary" to the primary contact
			},
		});
	};
}

export default new Controller();
