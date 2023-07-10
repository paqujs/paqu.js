import { exec } from 'node:child_process';

/**
 *
 * @param {string} command
 * @returns {Promise<string>}
 */
export const execSync = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout || stderr);
            }
        });
    });
};
