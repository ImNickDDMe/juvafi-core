import { z } from '@hono/zod-openapi';
import { validateID } from '$utils';

export default z
	.object({
		id: z.union(
			[
				z
					.string()
					.max(128)
					.refine((value) => validateID(value, 'usr'), {
						message: 'Invalid user ID.'
					})
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
					.refine((value) => validateID(value, 'usr'), {
						message: 'Invalid user ID.'
					})
					.openapi({
						param: {
							name: 'id',
							in: 'path',
							example: 'usr_wamg8oi4kku3krqcuz4dva9m',
						},
					}),
			]
		),
		firstName: z
			.string({
				required_error: 'Firstname is required for the payload data.',
			})
			.min(3, { message: 'Firstname must be longer than 2 character.' })
			.max(128, { message: 'Firstname must be shorter.' })
			.openapi({
				param: {
					name: 'firstName',
					in: 'query',
					example: 'Themistoklis',
				},
			}),
		middleName: z
			.string({
				required_error: 'Middlename is required for the payload.'
			})
			.min(3, { message: 'Middlename must be longer than 2 character.' })
			.max(128, { message: 'Middlename must be shorter' })
			.openapi({
				param: {
					name: 'middleName',
					in: 'query',
					example: 'Dimitrios',
				},
			}),
		lastName: z
			.string({
				required_error: 'Lastname is required for the payload data.',
			})
			.min(3, { message: 'Lastname must be longer than 2 character.' })
			.max(128, { message: 'Lastname must be shorter.' })
			.openapi({
				param: {
					name: 'lastName',
					in: 'query',
					example: 'Kontakos',
				},
			}),
		dateOfBirth: z
			.string({
				required_error: 'Birthdate is required for this operation.',
			})
			.date()
			.openapi({
				param: {
					name: 'dateOfBirth',
					in: 'query',
					example: '1998-04-25',
					description: 'Date defined in YYYY-MM-DD format.',
				},
			}),
		gender: z
			.enum(['Male', 'Female'], {
				required_error: 'Gender has to be specified.',
			})
			.openapi({
				param: {
					name: 'gender',
					in: 'query',
					example: 'Male',
				},
			}),
		nationality: z
			.string({
				required_error: 'Nationality is compulsory.',
			})
			.min(2, { message: 
				'Country code must be 2 characters long.' 
			})
			.max(2, { 
				message: 'Country code must be 2 characters long.' 
			})
			.openapi({
				param: {
					name: 'nationality',
					in: 'query',
					example: 'GR',
				},
			}),
		vatNumber: z
			.string({
				required_error: 'VAT number has to be declared.',
			})
			.min(9, { 
				message: 'VAT number should not be shorter than 9 digits. '
			})
			.max(9, { 
				message: 'VAT number should not be longer than 9 digits.' 
			})
			.openapi({
				param: {
					name: 'vatNumber',
					in: 'query',
					example: '042511078',
				},
			}),
	})
	.openapi('User');
