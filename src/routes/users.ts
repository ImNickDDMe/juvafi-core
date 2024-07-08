import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { ErrorSchema, generateID, initClient } from '$utils';
import { InterfaceToType } from 'hono/utils/types';
import { User } from '$schemas';

const router = new OpenAPIHono<{ Bindings: InterfaceToType<Env> }>();

// GET Method
const getSchema = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: User.pick({
            id: true,
        }),
    },
    responses: {
        200: {
            description: 'Returns the user details with success.',
            content: {
                'application/json': {
                    schema: User,
                },
            },
        },
        400: {
            description: 'Throws an error due to invalid parameters.',
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
router.openapi(
    getSchema,
    async (c) => {
        const { id } = c.req.valid('param');

        const database = initClient(c.env.DATABASE_URL);

        const result = await database.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst();

        if (!result) return c.json({ error: 'Nonexistent user.' }, 404);

        return c.json(result, 200);
    },
    (result, c) => {
        if (!result.success) return c.json({ error: 'Invalid or empty parameters.' }, 400);
    }
);

// POST Method
const postSchema = createRoute({
    method: 'post',
    path: '/',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: User.omit({
                        id: true,
                    }),
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Inserts the user successfully.',
            content: {
                'application/json': {
                    schema: User.pick({
                        id: true,
                    }),
                },
            },
        },
        400: {
            description: 'Throws an error due to invalid/insufficient data.',
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
        },
        500: {
            description: 'Throws en error due to unknown conditions.',
        },
    },
});

router.openapi(
    postSchema,
    async (c) => {
        const data = c.req.valid('json');

        const database = initClient(c.env.DATABASE_URL);

        const result = await database
            .insertInto('users')
            .values({
                id: generateID('usr'),
                ...data,
            })
            .returning('id')
            .executeTakeFirst();

        if (!result) return c.json({ error: 'Unexpected error.' }, 500);

        return c.json({ id: result.id }, 201);
    },
    (result, c) => {
        if (!result.success) return c.json({ error: 'Invalid or insufficient data.' }, 400);
    }
);

// PATCH Method
const patchSchema = createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
        params: User.pick({
            id: true,
        }),
        body: {
            content: {
                'application/json': {
                    schema: User.omit({
                        id: true,
                    }).partial(),
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Updates the user successfully.',
            content: {
                'application/json': {
                    schema: User,
                },
            },
        },
        400: {
            description: 'Throws an error due to insufficient data.',
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

router.openapi(patchSchema, async (c) => {
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');

    const database = initClient(c.env.DATABASE_URL);

    const response = await database.transaction().execute(async (trx) => {
        const updateResult = await trx.updateTable('users')
            .set(data)
            .where('id', '=', id).executeTakeFirst();

        const selectResult = await trx.selectFrom('users')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        return { updateResult, selectResult };
    });

    if (parseInt(response.updateResult.numUpdatedRows.toString()) == 0)
        return c.json({ error: 'Unexpected error.' }, 500);

    return c.json(response.selectResult, 200);

}, (result, c) => {
    if (!result.success)
        return c.json({ error: 'Insufficient or invalid data.' }, 400);
});

export default router;
