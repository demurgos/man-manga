/**
 * Only perform offline tests.
 * This means that there will be no request to any external server (such as Google, DBPedia, DBPediaSpotlight,etc.)
 * You can enable offline mode by setting the `OFFLINE_TESTS` environment variable to `true` (case-sensitive).
 *
 * Currently, the default value is `false` (perform requests to external server).
 * Offline mode is enable when performing Continuous Integration tests (to not exhaust the API keys).
 */
export const offline: boolean = process.env["OFFLINE_TESTS"] === "true";
