// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { it, expect, describe } from 'vitest';
import worker from '../src/index';

export const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Main Endpont', () => {
	it('Returns the appropriate message', async () => {
		const request = new IncomingRequest('http://localhost:8787/');
	
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe('JuvaFi Core');
	});
});

