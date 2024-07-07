import { InterfaceToType } from 'hono/utils/types';
import { OpenAPIHono } from '@hono/zod-openapi';
import { SwaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono<{ Bindings: InterfaceToType<Env> }>();

app.get('/', async (c) => {
	return c.json('JuvaFi Core');
});

app.get('/docs', async (c) => {
	return c.html(`
		<html>
			<head>
        		<meta charset="utf-8" />
        		<meta name="viewport" content="width=device-width, initial-scale=1" />
        		<meta name="description" content="SwaggerUI" />
        		<title>JuvaFi Core - SwaggerUI</title>
			</head>
			<body>
				<img src="https://i.ibb.co/JKVgH7h/logo.png" height="25%" />
				${SwaggerUI({ url: '/swagger' })}
			</body>
		</html>
	`);
});

app.doc('/swagger', {
	openapi: '3.1.0',
	info: {
		version: '1.0.0',
		title: 'JuvaFi Core'
	}
});

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return await app.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
