/**
 * @module Scrappey
 */

const axios = require('axios');

/**
 * A class representing the Scrappey library.
 */
class Scrappey {
    /**
     * Create a Scrappey instance.
     * @param {string} apiKey - The API key for authentication.
     */
    constructor(apiKey) {

        if (typeof apiKey === 'undefined' || apiKey.length === 0) {
            throw new Error('apiKey parameter is required.');
        }

        this.apiKey = apiKey;
        this.baseUrl = 'https://publisher.scrappey.com/api/v1';
    }

    /**
     * Sends a request to Scrappey.com.
     *
     * @param {string} endpoint - The endpoint for the request.
     * @param {string} method - The HTTP method for the request.
     * @param {Object} [data] - The request payload.
     * @returns {Promise<Object>} The response from the request.
     * @throws {Error} If the request fails.
     * @private
     */
    async sendRequest(endpoint, method, data = {}) {
        const url = `${this.baseUrl}?key=${this.apiKey}`;

        if (typeof data?.proxy === "string") {
            let validProxyStarts = ["socks4://", "socks5://", "http://", "https://"];
            if (!validProxyStarts.some(start => data.proxy.toLowerCase().startsWith(start))) {
                throw new Error(`Proxy must start with: ${validProxyStarts.join(", ")}`);
            }
        }

        const options = {
            url,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                cmd: endpoint,
                ...data
            }
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
    * Creates a new browser session.
    *
    * @param {Object} options - The options for creating a session.
    * @param {string|null} [options.sessionId] - The ID to assign to the session.
    * @param {Object|null} [options.proxy] - Proxy configuration for the session.
    * @returns {Promise<string>} The ID of the created session.
    */
    async createSession(options = {}) {
        const { sessionId = null, proxy = null } = options;
        return this.sendRequest('sessions.create', 'POST', { session: sessionId, proxy });
    }


    /**
     * Destroys a browser session.
     *
     * @param {string} sessionId - The ID of the session to destroy.
     * @returns {Promise<void>}
     */
    async destroySession(sessionId) {
        if (typeof sessionId === 'undefined') {
            throw new Error('sessionId parameter is required.');
        }

        return this.sendRequest('sessions.destroy', 'POST', { session: sessionId });
    }

    /**
     * Sends a GET request through Scrappey.com.
     *
     * @param {Object} options - The options for the GET request.
     * @param {string} options.url - The URL of the website to scrape.
     * @param {string|null} [options.sessionId] - The ID of the session to use for the request.
     * @param {Object|null} [options.cookiejar] - Cookies to be sent with the request.
     * @param {Object|null} [options.proxy] - Proxy configuration for the request.
     * @returns {Promise<Object>} The response from the request.
     */
    async getRequest(options) {
        const { url } = options;

        if (typeof url === 'undefined') {
            throw new Error('url parameter is required.');
        }

        return this.sendRequest('request.get', 'POST', {
            ...options
        });
    }

    /**
     * Sends a POST request through Scrappey.com.
     *
     * @param {Object} options - The options for the POST request.
     * @param {string} options.url - The URL of the website to scrape.
     * @param {string|Object} options.postData - The data to be sent in the request body. It should be in `application/x-www-form-urlencoded` format.
     * @param {string|null} [options.sessionId] - The ID of the session to use for the request.
     * @param {Object|null} [options.cookiejar] - Cookies to be sent with the request.
     * @param {Object|null} [options.proxy] - Proxy configuration for the request.
     * @returns {Promise<Object>} The response from the POST request.
     * @throws {Error} If the postData is not in `application/x-www-form-urlencoded` format and cannot be converted.
     */
    async postRequest(options) {
        // Continue with the rest of the code
        return this.sendRequest('request.post', 'POST', {
            ...options
        });
    }
}

module.exports = Scrappey;
