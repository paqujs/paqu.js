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
    plugins: [
        {
            name: 'fix-imports',
            renderChunk(_, chunk) {
                const code = chunk.code.replace(/from ['"](.*)['"]/g, (match, path) => {
                    if (path.startsWith('.') && !path.endsWith('.js')) {
                        return `from '${path}.js'`;
                    }

                    return match;
                });

                return { code };
            },
        },
    ],
});
