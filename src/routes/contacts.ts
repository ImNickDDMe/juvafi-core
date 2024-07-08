import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { initClient, generateID, ErrorSchema } from '$utils';
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
			description: 'Creates the contact with success.',
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

router.openapi(getSchema, async (c) => {
	const { id } = c.req.valid('param');

	const database = initClient(c.env.DATABASE_URL);

	const result = await database.selectFrom('contacts').selectAll().where('id', '=', id).executeTakeFirst();

	if (!result) return c.json({ error: 'Nonexistent contact' }, 404);

    return c.json(result, 200);
});

export default router;
