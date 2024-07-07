import { z } from '@hono/zod-openapi';
import { validateID } from '$utils';

export default z
	.object({
		id: z.union([
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'usr'))
				.openapi({
					param: {
						name: 'id',
						in: 'query',
						example: 'usr_vik6ciepc2n9si6dg26d3kj5',
					},
				}),
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'usr'))
				.openapi({
					param: {
						name: 'id',
						in: 'path',
						example: 'usr_wamg8oi4kku3krqcuz4dva9m',
					},
				}),
		]),
		firstName: z
			.string()
			.max(128)
			.openapi({
				param: {
					name: 'firstName',
					in: 'query',
					example: 'Themistoklis',
				},
			}),
		middleName: z
			.string()
			.max(128)
			.openapi({
				param: {
					name: 'middleName',
					in: 'query',
					example: 'Dimitrios',
				},
			}),
		lastName: z
			.string()
			.max(128)
			.openapi({
				param: {
					name: 'lastName',
					in: 'query',
					example: 'Kontakos',
				},
			}),
		dateOfBirth: z
			.string()
			.date()
			.openapi({
				param: {
					name: 'dateOfBirth',
					in: 'query',
					example: '1998-04-25',
					description: 'Date defined in YYYY-MM-DD format.',
				},
			}),
		gender: z.enum(['Male', 'Female']).openapi({
			param: {
				name: 'gender',
				in: 'query',
				example: 'Male',
			},
		}),
		nationality: z
			.string()
			.max(2)
			.openapi({
				param: {
					name: 'nationality',
					in: 'query',
					example: 'GR',
				},
			}),
        vatNumber: z
            .string()
            .max(9)
            .openapi({
                param: {
                    name: 'vatNumber',
                    in: 'query',
                    example: '042511078'
                }
            }),
        email: z
            .string()
            .email()
            .max(169)
            .openapi({
                param: {
                    name: 'email',
                    in: 'query',
                    example: 'themistkont@example.com'
                }
            })
	})
	.openapi('User');
