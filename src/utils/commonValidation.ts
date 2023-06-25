import { z } from 'zod';

export default class CommonValidation {
	static queryNumber = z.string().regex(/^\d+$/).transform(Number);
	static queryBoolean = z
		.string()
		.regex(/^(true|false)$/)
		.transform(x => x === 'true');
}
