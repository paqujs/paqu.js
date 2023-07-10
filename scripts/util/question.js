import consola from 'consola';

/**
 *
 * @param {string} question
 * @returns {Promise<string>}
 */
export const question = (question) => {
    return new Promise((resolve) => {
        consola.info(question);
        process.stdout.write('> ');

        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};
