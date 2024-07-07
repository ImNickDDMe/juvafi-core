import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { InterfaceToType } from 'hono/utils/types';
import { ErrorSchema, initClient } from '$utils';
import { User } from '$schemas';

const router = new OpenAPIHono<{ Bindings: InterfaceToType<Env> }>();

const getSchema = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: User.pick({
            id: true
        })
    },
    responses: {
        200: {
            description: 'Returns the user details with success.',
            content: {
                'application/json': {
                    schema: User
                }
            }
        },
        400: {
            description: 'Throws an error due to invalid parameters.',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        },
        404: {
            description: 'Throws an error due to inexistent record.',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
    }
});

// @ts-ignore
router.openapi(getSchema, async (c) => {
    const { id } = c.req.valid('param');

    const database = initClient(c.env.DATABASE_URL);

    const result = await database.selectFrom('users').selectAll()
        .where('id', '=', id).executeTakeFirst();

    if (!result) return c.json({ error: 'Nonexistent user.' }, 404);

    return c.json(result, 200);
}, (result, c) => {
    if (!result.success) 
        return c.json({ error: 'Invalid or empty parameters.' }, 400);
});

export default router;