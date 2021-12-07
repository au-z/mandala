import path from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
	server: {
		port: 8001,
	},
	build: {
		emptyOutDir: false,
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'mandala',
		},
	},
})