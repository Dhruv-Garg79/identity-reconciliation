import { NextFunction, Request, Response } from 'express';
import ContactsTable from '../../models/contactsTable';
import Logger from '../../utils/logger';

class Controller {
	private readonly logger = new Logger('Identity Controller');
	private readonly contactsTable = new ContactsTable();

	public identify = async (req: Request, res: Response, next: NextFunction) => {
		const contacts = await this.contactsTable.getAll();
		return contacts.apiResponse(res);
	};
}

export default new Controller();
