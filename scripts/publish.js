import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import consola from 'consola';

const execSync = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout || stderr);
        });
    });
};

const question = (question) => {
    return new Promise((resolve) => {
        consola.info(question);
        process.stdout.write('> ');

        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};

question('Package name?').then((packageName) => {
    const packagePath = path.resolve(process.cwd(), 'packages', packageName);

    if (!fs.existsSync(packagePath)) {
        consola.error(`Package ${packageName} does not exist`);
        return process.exit(1);
    }

    const packageJSON = JSON.parse(
        fs.readFileSync(path.join(packagePath, 'package.json'), 'utf-8'),
    );

    question(`New version? (Current version is v${packageJSON.version})`).then((packageVersion) => {
        packageJSON.version = packageVersion;

        fs.writeFileSync(
            path.join(packagePath, 'package.json'),
            JSON.stringify(packageJSON, null, 4),
        );

        consola.success(`Package version updated to v${packageVersion}`);

        question('Upgrade dependencies? [y/n]').then(async (answer) => {
            if (answer === 'y') {
                await execSync(`cd ${packagePath} && pnpm upgrade --latest`)
                    .catch((error) => {
                        consola.error(`Dependencies upgrade failed with error: ${error}`);
                        process.exit(1);
                    })
                    .then(() => consola.success(`Dependencies upgraded`));
            }

            execSync(`cd ${packagePath} && pnpm build`).then(() => {
                const distPath = path.join(packagePath, 'dist');
                const dist = fs.readdirSync(distPath, { withFileTypes: true });

                dist.forEach((file) => {
                    if (file.isDirectory()) {
                        fs.rm(
                            path.join(distPath, file.name),
                            { recursive: true, force: true },
                            (error) => {
                                if (error) {
                                    consola.error(`Package build failed with error: ${error}`);
                                    process.exit(1);
                                }
                            },
                        );
                    } else if (file.name !== 'index.js' && file.name !== 'index.d.ts') {
                        fs.rm(path.join(distPath, file.name), (error) => {
                            if (error) {
                                consola.error(`Package build failed with error: ${error}`);
                                process.exit(1);
                            }
                        });
                    }
                });

                consola.success(`Package builded`);

                question('This version is a first release? [y/n]').then((answer) => {
                    question('OTP?').then((otp) => {
                        execSync(
                            `cd ${packagePath} && pnpm publish --otp ${otp}${
                                answer === 'y' ? ' --access public' : ''
                            }`,
                        )
                            .then(() => {
                                consola.success(`Package published`);

                                execSync(`cd ${packagePath} && git add .`)
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
                                                        consola.error(
                                                            `Package publish failed with error: ${error}`,
                                                        );
                                                        process.exit(1);
                                                    });
                                            })
                                            .catch((error) => {
                                                consola.error(
                                                    `Package publish failed with error: ${error}`,
                                                );
                                                process.exit(1);
                                            });
                                    })
                                    .catch((error) => {
                                        consola.error(
                                            `Package publish failed with error: ${error}`,
                                        );
                                        process.exit(1);
                                    });
                            })
                            .catch((error) => {
                                consola.error(`Package publish failed with error: ${error}`);
                                process.exit(1);
                            });
                    });
                });
            });
        });
    });
});
