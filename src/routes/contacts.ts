import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { initClient, generateID, ErrorSchema } from '$utils';
import { InterfaceToType } from 'hono/utils/types';

const router = new OpenAPIHono<{ Bindings: InterfaceToType<Env> }>();

export default router;