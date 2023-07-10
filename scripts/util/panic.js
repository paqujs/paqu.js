import consola from 'consola';

/**
 *
 * @param {string} message
 * @returns {void}
 */
export const panic = (message) => {
    consola.error(message);
    process.exit(1);
};
