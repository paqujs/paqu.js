import fs from 'node:fs';
import path from 'node:path';
import consola from 'consola';
import { execa } from 'execa';

import { question } from './util/question.js';
import { panic } from './util/panic.js';

(async () => {
    const packageName = await question('Package name?');
    const packagePath = path.resolve(process.cwd(), 'packages', packageName);

    if (!fs.existsSync(packagePath)) {
        panic(`Package ${packageName} does not exist`);
    }

    const packageJSON = JSON.parse(
        fs.readFileSync(path.join(packagePath, 'package.json'), 'utf-8'),
    );

    const packageVersion = await question(
        `New version? (Current version is v${packageJSON.version})`,
    );

    packageJSON.version = packageVersion;

    fs.writeFileSync(path.join(packagePath, 'package.json'), JSON.stringify(packageJSON, null, 4));

    consola.success(`Package version updated to v${packageVersion}`);

    const answer = await question('Upgrade dependencies? [y/n]');
    if (answer === 'y') {
        await execa(`cd ${packagePath} && pnpm upgrade --latest`).catch((error) =>
            panic(`Dependencies upgrade failed with error: ${error}`),
        );

        consola.success('Dependencies upgraded');
    }

    await execa(`cd ${packagePath} && pnpm build`).catch((error) =>
        panic(`Package build failed with error: ${error}`),
    );

    consola.success(`Package builded`);

    const isFirstRelease = await question('This version is a first release? [y/n]');
    const otp = await question('OTP? (or press enter if 2FA is not enabled)');

    await execa(
        `cd ${packagePath} && pnpm publish --no-git-checks${
            isFirstRelease === 'y' ? ' --access public' : ''
        }${otp ? ` --otp ${otp}` : ''}`,
    ).catch((error) => panic(`Package publish failed with error: ${error}`));

    consola.success(`Package published to npm`);

    await execa(`cd ${packagePath} && git add .`).catch((error) =>
        panic(`Package publish failed with error: ${error}`),
    );

    await execa(
        `cd ${packagePath} && git commit -m "chore: release ${packageName}@${packageVersion}"`,
    ).catch((error) => panic(`Package publish failed with error: ${error}`));

    await execa(`cd ${packagePath} && git push`).catch((error) =>
        panic(`Package publish failed with error: ${error}`),
    );

    consola.success(`New version ${packageVersion} of package ${packageName} published`);
    process.exit(0);
})();
