import { validateID, generateID } from '$utils';
import { z } from '@hono/zod-openapi';

export default z
	.object({
		id: z.union([
			z
				.string()
				.max(128)
				.refine((value) => validateID(value, 'cnct'), {
					message: 'Invalid contact ID.'
				})
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
				.refine((value) => validateID(value, 'cnct'), {
					message: 'Invalid contact ID.'
				})
				.openapi({
					param: {
						name: 'id',
						in: 'query',
						example: generateID('cnct'),
					},
				}),
		]),
		userId: z
			.string({
				required_error: 'User ID is required for this payload.'
			})
			.max(128, { message: 'User ID has to be shorter.' })
			.refine((value) => validateID(value, 'usr'), {
				message: 'Specify a valid user ID.'
			})
			.openapi({
				param: {
					name: 'userId',
					in: 'query',
					example: generateID('cnct'),
				},
			}),
		mainStreet: z
			.string({
				message: 'Please specify a main street.'
			})
			.max(128, { message: 'Main street is too long.' })
			.openapi({
				param: {
					name: 'mainStreet',
					in: 'query',
					example: 'Vasileos Georgiou 12',
				},
			}),
		secStreet: z
			.string({
				required_error: 'Please specify a secondary street.'
			})
			.max(128, {
				message: 'Sec. street should be shorter.'
			})
			.openapi({
				param: {
					name: 'secStreet',
					in: 'query',
					example: 'Maizonos',
				},
			}),
		postalCode: z
			.string()
			.min(5, { message: 
				'Postal code must be 2 characters long.' 
			})
			.max(5, { 
				message: 'Postal code must be 2 characters long.' 
			})
			.openapi({
				param: {
					name: 'postalCode',
					in: 'query',
					example: '26226',
				},
			}),
		city: z
			.string({
				required_error: 'City is required.'
			})
			.max(128, {
				message: 'City is too long.'
			})
			.openapi({
				param: {
					name: 'city',
					in: 'query',
					example: 'Patra',
				},
			}),
		country: z
			.string()
			.min(2, { message: 
				'Country code must be 2 characters long.' 
			})
			.max(2, { 
				message: 'Country code must be 2 characters long.' 
			})
			.openapi({
				param: {
					name: 'country',
					in: 'query',
					example: 'GR',
				},
			}),
        mobileNumber: z
            .string({
				message: 'Please specify a mobile phone.'
			})
			.max(13)
            .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
				message: 'Invalid mobile phone.'
			})
            .openapi({
                param: {
                    name: 'mobileNumber',
                    in: 'query',
                    example: '+306985126790'
                }
            }),
        email: z
            .string({
				message: 'Email address is required for this payload.'
			})
            .email({
				message: 'Invalid email address.'
			})
			.min(12, {
				message: 'Email address should be longer.'
			})
			.max(169, {
				message: 'Email address is too long.'
			})
            .openapi({
                param: {
                    name: 'email',
                    in: 'query',
                    example: 'themikont@example.com'
                }
            })
	})
	.openapi('Contact');
