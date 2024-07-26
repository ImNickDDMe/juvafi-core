import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import { resolve } from 'node:path';

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
	resolve: {
		alias: {
			'$schemas': resolve(__dirname, './src/schemas/index'),
		  	'$routes': resolve(__dirname, './src/routes/index'),
			'$utils': resolve(__dirname, './src/utils')
		},
	},
});
