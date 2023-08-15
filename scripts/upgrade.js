import fs from 'node:fs';
import path from 'node:path';
import consola from 'consola';

import { execSync } from './util/execSync.js';
import { panic } from './util/panic.js';

(async () => {
    for (const packageName of fs.readdirSync('./packages')) {
        const packagePath = path.resolve(process.cwd(), 'packages', packageName);

        consola.info(`Upgrading dependencies for ${packageName}...`);

        await execSync(`cd ${packagePath} && pnpm upgrade --latest`).catch((error) => {
            panic(`Failed to upgrade dependencies for ${packageName}`, error);
        });
    }
})();
