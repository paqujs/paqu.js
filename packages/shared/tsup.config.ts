import { defineConfig } from 'tsup';

export default defineConfig({
    target: 'esnext',
    keepNames: true,
    entryPoints: ['./src/**/*.ts'],
    clean: true,
    format: 'esm',
    splitting: false,
    minify: false,
    shims: true,
    platform: 'node',
    dts: {
        entry: './src/index.ts',
        resolve: false,
    },
});
