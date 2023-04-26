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

        execSync(`cd ${packagePath} && yarn build`)
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
                                    consola.error(`Package build failed with error: ${error}`);
                                    process.exit(1);
                                }
                            },
                        );
                    } else {
                        fs.stat(path.join(distPath, file.name), (error, stats) => {
                            if (error) {
                                consola.error(`Package build failed with error: ${error}`);
                                process.exit(1);
                            }

                            if (stats.size <= 0) {
                                fs.rm(path.join(distPath, file.name), { force: true }, (error) => {
                                    if (error) {
                                        consola.error(`Package build failed with error: ${error}`);
                                        process.exit(1);
                                    }
                                });
                            }
                        });
                    }
                });

                consola.success(`Package builded`);

                question('OTP?').then((otp) => {
                    execSync(`cd ${packagePath} && yarn publish --otp ${otp}`)
                        .then(() => {
                            consola.success(`Package published`);
                            execSync(`cd ${packagePath} && git add .`)
                                .then(() => {
                                    execSync(
                                        `cd ${packagePath} && git commit -m "${packageName}: v${packageVersion}"`,
                                    )
                                        .then(() => {
                                            execSync(`cd ${packagePath} && git push`)
                                                .then(() => {
                                                    consola.success(
                                                        `New version ${packageVersion} of package ${packageName} published`,
                                                    );
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
                        })
                        .catch((error) => {
                            consola.error(`Package publish failed with error: ${error}`);
                            process.exit(1);
                        });
                });
            })
            .catch((error) => {
                consola.error(`Package build failed with error: ${error}`);
                process.exit(1);
            });
    });
});
