import { generateID, validateID } from '$utils';
import { z } from '@hono/zod-openapi';

export default z
	.object({
		id: z.union([
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'ldgr'), {
					message: 'Invalid ledger ID.',
				})
				.openapi({
					param: {
						name: 'id',
						in: 'path',
						example: generateID('ldgr'),
					},
				}),
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'ldgr'), {
					message: 'Invalid ledger ID.',
				})
				.openapi({
					param: {
						name: 'id',
						in: 'query',
						example: generateID('ldgr'),
					},
				}),
		]),
		userId: z
			.string()
			.max(128)
			.refine((value) => validateID(value, 'usr'), {
				message: 'Invalid user ID.'
			})
			.openapi({
				param: {
					name: 'userId',
					in: 'query',
					example: generateID('usr'),
				},
			}),
		friendlyName: z
			.string({
				required_error: 'A friendly name is required for this payload.',
			})
			.max(64)
			.openapi({
				param: {
					name: 'friendlyName',
					in: 'query',
					example: 'Payroll',
				},
			}),
		currency: z
			.string({
				required_error: 'Specify a currency.',
			})
			.min(3, {
				message: 'Currency should be 3 characters long.',
			})
			.max(3, {
				message: 'Currency should be 3 characters long.',
			})
			.openapi({
				param: {
					name: 'currency',
					in: 'query',
					example: 'EUR',
				},
			}),
		accountNumber: z
			.string()
			.default((Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000).toString())
			.openapi({
				param: {
					name: 'accountNumber',
					in: 'query',
					example: '9982511270',
				},
			}),
		balance: z
			.number()
			.default(0.0)
			.openapi({
				param: {
					name: 'balance',
					in: 'query',
					example: '1265.38',
				},
			}),
	})
	.openapi('Ledger');
