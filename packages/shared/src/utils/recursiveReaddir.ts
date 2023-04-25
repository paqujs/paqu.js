import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function recursiveReaddir(filePath: string): string[] {
    return readdirSync(filePath).reduce((accumulator: string[], file: string) => {
        const resolvedName = join(filePath, file);
        return lstatSync(resolvedName).isDirectory()
            ? [...accumulator, ...recursiveReaddir(resolvedName)]
            : [...accumulator, resolvedName];
    }, []);
}
