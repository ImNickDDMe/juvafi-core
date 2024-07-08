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

router.openapi(getSchema, async (c) => {
	const { id } = c.req.valid('param');

	const database = initClient(c.env.DATABASE_URL);

	const result = await database.selectFrom('contacts').selectAll().where('id', '=', id).executeTakeFirst();

	if (!result) return c.json({ error: 'Nonexistent contact' }, 404);

	return c.json(result, 200);
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
                    schema: ErrorSchema
                }
            }
        },
        500: {
            description: 'Throws an error due to unknown conditions.',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
	},
});

router.openapi(postSchema, async (c) => {
    const data = c.req.valid('json');

    const database = initClient(c.env.DATABASE_URL);

    const result = await database.insertInto('contacts')
        .values({
            id: generateID('cnct'),
            ...data
        }).returning('id').executeTakeFirst();

    if (!result) return c.json({ error: 'Unexpected error.' }, 500);

    return c.json({ id: result.id }, 201);
}, (result, c) => {
    if (!result.success)
        return c.json({ error: 'Insufficient or invalid data.' }, 400);
});

export default router;
