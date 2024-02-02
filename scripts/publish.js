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

    if (packageVersion.trim() !== '') {
        packageJSON.version = packageVersion;

        fs.writeFileSync(
            path.join(packagePath, 'package.json'),
            JSON.stringify(packageJSON, null, 4),
        );

        consola.success(`Package version updated to v${packageVersion}`);
    }

    const answer = await question('Upgrade dependencies? [y/n]');
    if (answer === 'y') {
        await execa('pnpm', ['upgrade', '--latest'], { cwd: packagePath }).catch((error) =>
            panic(`Dependencies upgrade failed with error: ${error}`),
        );

        consola.success('Dependencies upgraded');
    }

    await execa('pnpm', ['build'], { cwd: packagePath }).catch((error) =>
        panic(`Package build failed with error: ${error}`),
    );

    consola.success('Package builded');

    const isFirstRelease = await question('This version is a first release? [y/n]');
    const otp = await question('OTP? (or press enter if 2FA is not enabled)');

    await execa(
        'pnpm',
        [
            'publish',
            '--no-git-checks',
            ...(isFirstRelease === 'y' ? ['--access', 'public'] : []),
            ...(otp ? ['--otp', otp] : []),
        ].filter(Boolean),
        { cwd: packagePath },
    ).catch((error) => panic(`Package publish failed with error: ${error}`));

    consola.success('Package published to npm');

    await execa('git', ['add', '.'], { cwd: packagePath }).catch((error) =>
        panic(`Package publish failed with error: ${error}`),
    );

    await execa('git', ['commit', '-m', `chore: release ${packageName}@${packageVersion}`], {
        cwd: packagePath,
    }).catch((error) => panic(`Package publish failed with error: ${error}`));

    await execa('git', ['push'], { cwd: packagePath }).catch((error) =>
        panic(`Package publish failed with error: ${error}`),
    );

    consola.success(`New version ${packageVersion} of package ${packageName} published`);
    process.exit(0);
})();
