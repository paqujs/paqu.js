import { defineConfig } from 'tsup';

export default defineConfig({
    target: 'node16',
    dts: {
        resolve: true,
        entry: './src/index.ts',
    },
    keepNames: true,
    entryPoints: ['./src/**/*.ts'],
    clean: true,
    format: 'esm',
    splitting: true,
    bundle: false,
    minify: false,
});
