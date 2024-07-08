import { validateID, generateID } from '$utils';
import { z } from '@hono/zod-openapi';

export default z
	.object({
		id: z.union([
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'cnct'))
				.openapi({
					param: {
						name: 'id',
						in: 'path',
						example: generateID('cnct'),
					},
				}),
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'cnct'))
				.openapi({
					param: {
						name: 'id',
						in: 'query',
						example: generateID('cnct'),
					},
				}),
		]),
		userId: z
			.string()
			.max(128)
			.refine((value) => validateID(value, 'usr'))
			.openapi({
				param: {
					name: 'userId',
					in: 'query',
					example: generateID('usr'),
				},
			}),
		mainStreet: z
			.string()
			.max(128)
			.openapi({
				param: {
					name: 'mainStreet',
					in: 'query',
					example: 'Vasileos Georgiou 12',
				},
			}),
		secStreet: z
			.string()
			.max(128)
			.openapi({
				param: {
					name: 'secStreet',
					in: 'query',
					example: 'Maizonos',
				},
			}),
		postalCode: z
			.string()
			.max(5)
			.openapi({
				param: {
					name: 'postalCode',
					in: 'query',
					example: '26226',
				},
			}),
		city: z
			.string()
			.max(128)
			.openapi({
				param: {
					name: 'city',
					in: 'query',
					example: 'Patra',
				},
			}),
		country: z
			.string()
			.max(2)
			.openapi({
				param: {
					name: 'country',
					in: 'query',
					example: 'GR',
				},
			}),
        mobileNumber: z
            .string()
            .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
            .openapi({
                param: {
                    name: 'mobileNumber',
                    in: 'query',
                    example: '+306985126790'
                }
            }),
        email: z
            .string()
            .email()
            .openapi({
                param: {
                    name: 'email',
                    in: 'query',
                    example: 'themikont@example.com'
                }
            })
	})
	.openapi('Contact');
