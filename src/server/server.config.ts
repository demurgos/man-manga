import * as path from "path";
import * as url from "url";

/**
 * The root path of the application.
 * @type {string}
 */
export const serverRoot = path.join(__dirname, '..');
export const appRoot = path.join(serverRoot, "app");
export const staticRoot = path.join(serverRoot, "static");
export const projectRoot = path.join(serverRoot, '../..');
export const clientRoot = path.join(projectRoot, 'build/client');

/**
 * The host where the server is running.
 * @type {string}
 */
export const serverHost = "localhost";

/**
 * The port where the server is running.
 * @type {number}
 */
export const serverPort = 3000;

/**
 * The external URL to the root of the server
 * @type {string}
 */
export const externalUrl: string = url.format({protocol: "http", host: serverHost, port: serverPort.toString(10)});
