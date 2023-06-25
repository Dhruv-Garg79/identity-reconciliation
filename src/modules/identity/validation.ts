import { z } from 'zod';

export default {
	identify: z.object({
		body: z.object({
			email: z.string().nullable().optional(),
			phoneNumber: z.number().transform(String).nullable().optional(),
		}),
	}),
};
