import * as path from 'path';

/**
 * The root path of the application.
 * @type {string}
 */
export const ROOT = path.join(path.resolve(__dirname, '../../..'));

/**
 * The host where the server is running.
 * @type {string}
 */
export const SERVER_HOST = 'localhost';

/**
 * The port where the server is running.
 * @type {number}
 */
export const SERVER_PORT = 3000;

/**
 * The URL to access the server locally.
 * @type {string}
 */
export const SERVER_URL = 'http://' + SERVER_HOST + ':' +SERVER_PORT;