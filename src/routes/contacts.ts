import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { initClient, generateID, ErrorSchema, handleValidationErrors } from '$utils';
import { InterfaceToType } from 'hono/utils/types';
import { Contact } from '$schemas';

const router = new OpenAPIHono<{ Bindings: InterfaceToType<Env> }>();

// GET Method

const getSchema = createRoute({
	method: 'get',
	path: '/{id}',
	request: {
		params: Contact.pick({
			id: true,
		}),
	},
	responses: {
		200: {
			description: 'Returns the contact data with success.',
			content: {
				'application/json': {
					schema: Contact,
				},
			},
		},
		400: {
			description: 'Throws an error due to invalid/insufficient parameters.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
		404: {
			description: 'Throws an error due to inexistent record.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
	},
});

// @ts-ignore
router.openapi(getSchema, async (c) => {
	const { id } = c.req.valid('param');

	const database = initClient(c.env.DATABASE_URL);

	const result = await database.selectFrom('contacts').selectAll().where('id', '=', id).executeTakeFirst();

	if (!result) return c.json({ error: 'Nonexistent contact' }, 404);

	return c.json(result, 200);
}, (result, c) => {
	if (!result.success) 
		return c.json(handleValidationErrors(result.error.errors), 400);
});

// POST Method

const postSchema = createRoute({
	method: 'post',
	path: '/',
	request: {
		body: {
			content: {
				'application/json': {
					schema: Contact.omit({
						id: true,
					}),
				},
			},
		},
	},
	responses: {
		201: {
			description: 'Inserts the contact data with success.',
			content: {
				'application/json': {
					schema: Contact.pick({ id: true }),
				},
			},
		},
		400: {
			description: 'Throws an error due to insufficient/invalid data.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
		500: {
			description: 'Throws an error due to unknown conditions.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
	},
});

router.openapi(
	postSchema,
	// @ts-ignore
	async (c) => {
		const data = c.req.valid('json');

		const database = initClient(c.env.DATABASE_URL);

		const result = await database
			.insertInto('contacts')
			.values({
				id: generateID('cnct'),
				...data,
			})
			.returning('id')
			.executeTakeFirst();

		if (!result) return c.json({ error: 'Unexpected error.' }, 500);

		return c.json({ id: result.id }, 201);
	},
	(result, c) => {
		if (!result.success) 
			return c.json(handleValidationErrors(result.error.errors), 400);
	}
);

// PATCH Method

const patchSchema = createRoute({
	method: 'patch',
	path: '/{id}',
	request: {
		params: Contact.pick({ id: true }),
		body: {
			content: {
				'application/json': {
					schema: Contact.omit({ id: true }).partial(),
				},
			},
		},
	},
	responses: {
		200: {
			description: 'Updates the contact data successfully.',
			content: {
				'application/json': {
					schema: Contact,
				},
			},
		},
		400: {
			description: 'Throws an error due to insufficient parameters.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
		500: {
			description: 'Throws an error due to unknown conditions.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
	},
});

router.openapi(
	patchSchema,
	// @ts-ignore
	async (c) => {
		const { id } = c.req.valid('param');
		const data = c.req.valid('json');

		const database = initClient(c.env.DATABASE_URL);

		const response = await database.transaction().execute(async (trx) => {
			const updateResult = await trx.updateTable('contacts').set(data).where('id', '=', id).executeTakeFirst();

			const selectResult = await trx.selectFrom('contacts').selectAll().where('id', '=', id).executeTakeFirst();

			return { updateResult, selectResult };
		});

		if (parseInt(response.updateResult.numUpdatedRows.toString()) == 0) return c.json({ error: 'Unexpected error.' }, 500);

		return c.json(response.selectResult, 200);
	},
	(result, c) => {
		if (!result.success) 
			return c.json(handleValidationErrors(result.error.errors), 400);
	}
);

// DELETE Method

const deleteSchema = createRoute({
	method: 'delete',
	path: '/{id}',
	request: {
		params: Contact.pick({ id: true }),
	},
	responses: {
		200: {
			description: 'Deletes the contact successfully.',
			content: {
				'application/json': {
					schema: z.object({ message: z.string() }),
				},
			},
		},
		400: {
			description: 'Throws an error due to insufficient parameters.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
		500: {
			description: 'Throws an error due to unknown conditions.',
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
		},
	},
});

// @ts-ignore
router.openapi(deleteSchema, async (c) => {
	const { id } = c.req.valid('param');

	const database = initClient(c.env.DATABASE_URL);

	const result = await database.deleteFrom('contacts')
		.where('id', '=', id)
		.executeTakeFirst();

	if (parseInt(result.numDeletedRows.toString()) == 0)
		return c.json({ error: 'Unexpected error.' }, 500);

	return c.json({ message: 'Contact deleted successfully.' }, 200);
}, (result, c) => {
	if (!result.success) 
		return c.json(handleValidationErrors(result.error.errors), 400);
});

export default router;
