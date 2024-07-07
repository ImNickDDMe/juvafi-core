import { createId, isCuid } from '@paralleldrive/cuid2';
import { NeonDialect } from 'kysely-neon';
import type { DB } from 'kysely-codegen';
import { z } from '@hono/zod-openapi';
import { Kysely } from 'kysely';

export const generateID = (prefix: string) => `${prefix}_${createId()}`;

export const validateID = (input: string, prefix: string) =>
    input.split('_')[0] == prefix && isCuid(input.split('_')[1]);

export const initClient = (connectionString: string) =>
    new Kysely<DB>({ dialect: new NeonDialect({ connectionString }) });

export const ErrorSchema = z.object({
    error: z.string()
}).openapi('ErrorSchema');