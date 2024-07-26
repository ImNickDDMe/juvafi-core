import { initClient, ErrorSchema, handleValidationErrors, ValidationErrorSchema } from '$utils';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { InterfaceToType } from 'hono/utils/types';
import { Ledger } from '$schemas';

const router = new OpenAPIHono<{ Bindings: InterfaceToType<Env> }>();

// GET Method

const getSchema = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: Ledger.pick({
            id: true
        })
    },
    responses: {
        200: {
            description: 'Returns the ledger with success.',
            content: {
                'application/json': {
                    schema: Ledger.pick({
                        id: true
                    })
                }
            }
        },
        400: {
            description: 'Throws an error due to invalid parameters.',
            content: {
                'application/json': {
                    schema: ValidationErrorSchema
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

router.openapi(getSchema, async (c) => {
    const { id } = c.req.valid('param');

    const database = initClient(c.env.DATABASE_URL);

    const result = await database.selectFrom('ledgers').selectAll()
        .where('id', '=', id).executeTakeFirst();

    if (!result) return c.json({ message: 'Nonexistent ledger.' }, 404);

    return c.json(result, 200);
}, (result, c) => {
    if (!result.success)
        return c.json(handleValidationErrors(result.error.errors), 400);
});

export default router;