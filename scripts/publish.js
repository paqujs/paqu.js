import fs from 'node:fs';
import path from 'node:path';
import consola from 'consola';

import { execSync } from './util/execSync.js';
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
        await execSync(`cd ${packagePath} && pnpm upgrade --latest`)
            .catch((error) => {
                panic(`Dependencies upgrade failed with error: ${error}`);
            })
            .then(() => consola.success(`Dependencies upgraded`));
    }

    await execSync(`cd ${packagePath} && pnpm build`)
        .then(() => {
            const distPath = path.join(packagePath, 'dist');
            const dist = fs.readdirSync(distPath, { withFileTypes: true });

            dist.forEach((file) => {
                if (file.isDirectory()) {
                    fs.rm(
                        path.join(distPath, file.name),
                        { recursive: true, force: true },
                        (error) => {
                            if (error) {
                                throw error;
                            }
                        },
                    );
                } else if (file.name !== 'index.js' && file.name !== 'index.d.ts') {
                    fs.rm(path.join(distPath, file.name), (error) => {
                        if (error) {
                            throw error;
                        }
                    });
                }
            });

            consola.success(`Package builded`);
        })
        .catch((error) => {
            panic(`Package build failed with error: ${error}`);
        });

    const isFirstRelease = await question('This version is a first release? [y/n]');
    const otp = await question('OTP? (or press enter if 2FA is not enabled)');

    await execSync(
        `cd ${packagePath} && pnpm publish --no-git-checks${isFirstRelease === 'y' ? ' --access public' : ''}${
            otp ? ` --otp ${otp}` : ''
        }`,
    )
        .then(() => {
            consola.success(`Package published to npm`);
        })
        .catch((error) => {
            panic(`Package publish failed with error: ${error}`);
        });

    await execSync(`cd ${packagePath} && git add .`)
        .then(() => {
            execSync(
                `cd ${packagePath} && git commit -m "chore: release ${packageName}@${packageVersion}"`,
            )
                .then(() => {
                    execSync(`cd ${packagePath} && git push`)
                        .then(() => {
                            consola.success(
                                `New version ${packageVersion} of package ${packageName} published`,
                            );
                            process.exit(0);
                        })
                        .catch((error) => {
                            panic(`Package publish failed with error: ${error}`);
                        });
                })
                .catch((error) => {
                    panic(`Package publish failed with error: ${error}`);
                });
        })
        .catch((error) => {
            panic(`Package publish failed with error: ${error}`);
        });
})();
