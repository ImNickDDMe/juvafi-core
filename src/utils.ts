import { createId, isCuid } from '@paralleldrive/cuid2';
import { NeonDialect } from 'kysely-neon';
import type { DB } from 'kysely-codegen';
import { z } from '@hono/zod-openapi';
import { Kysely } from 'kysely';
import { ZodIssue } from 'zod';

type FormattedError = {
	message: ZodIssue['message'];
	target: ZodIssue['path'][0];
};

export const handleValidationErrors = (issues: ZodIssue[]) => {
	const formattedErrors: FormattedError[] = [];

	issues.forEach((issue) => {
		formattedErrors.push({
			message: issue.message,
			target: issue.path['0']
		});
	});

	return formattedErrors;
};

export const generateID = (prefix: string) => `${prefix}_${createId()}`;

export const validateID = (input: string, prefix: string) => input.split('_')[0] == prefix && isCuid(input.split('_')[1]);

export const initClient = (connectionString: string) => new Kysely<DB>({ dialect: new NeonDialect({ connectionString }) });

export const ValidationErrorSchema = z.array(z.object({
	message: z.custom<ZodIssue['message']>(),
	target: z.custom<ZodIssue['path'][0]>()
})).openapi('ValidationErrorSchema');

export const ErrorSchema = z.object({
	message: z.string()
}).openapi('ErrorSchema');
