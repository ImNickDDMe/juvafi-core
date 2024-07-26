import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { IncomingRequest } from './index.spec';
import { it, expect, describe } from 'vitest';
import worker from '../src/index';

describe('Users Endpoint', () => {
    let userId: string;

    it('Creates an user successfully', async () => {
        const request = new IncomingRequest('http://localhost:8787/users', {
            method: 'POST',
            body: JSON.stringify({
                firstName: 'Themistoklis',
                middleName: 'Dimitrios',
                lastName: 'Kontakos',
                dateOfBirth: '1989-09-25',
                gender: 'Male',
                nationality: 'GR',
                vatNumber: '112859455'
            })
        });

        const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(201);

        userId = (await response.json<{ id: string; }>()).id;
    });

    it('Returns details about an user', async () => {
        const request = new IncomingRequest(
            `http://localhost:8787/users/${userId}`
        );

        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);

        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);
    });

    it('Updates user details', async () => {
        const request = new IncomingRequest(
            `http://localhost:8787/users/${userId}`,
            {
                method: 'PATCH'
            }
        );

        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);

        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);
    });

    it('Deletes an user', async () => {
        const request = new IncomingRequest(
            `http://localhost:8787/users/${userId}`,
            {
                method: 'DELETE'
            }
        );

        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);

        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);
    });
});