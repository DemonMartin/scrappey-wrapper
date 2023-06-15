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
     * @param {string|null} [sessionId] - The ID to assign to the session.
     * @param {Object|null} [proxy] - Proxy configuration for the session.
     * @returns {Promise<string>} The ID of the created session.
     */
    async createSession(sessionId = null, proxy = null) {
        return this.sendRequest('sessions.create', 'POST', { session: sessionId, proxy });
    }

    /**
     * Destroys a browser session.
     *
     * @param {string} sessionId - The ID of the session to destroy.
     * @returns {Promise<void>}
     */
    async destroySession(sessionId) {
        if (typeof sessionId === "undefined") {
            throw new Error('sessionId parameter is required.');
        }

        return this.sendRequest('sessions.destroy', 'POST', { session: sessionId });
    }

    /**
     * Sends a GET request through Scrappey.com.
     *
     * @param {string} url - The URL of the website to scrape.
     * @param {string|null} [sessionId] - The ID of the session to use for the request.
     * @param {Object|null} [cookiejar] - Cookies to be sent with the request.
     * @param {Object|null} [proxy] - Proxy configuration for the request.
     * @returns {Promise<Object>} The response from the request.
     */
    async getRequest(url, sessionId = null, cookiejar = null, proxy = null) {
        if (typeof url === "undefined") {
            throw new Error('url parameter is required.');
        }

        if (typeof sessionId === "undefined" && typeof cookiejar === "undefined" && typeof proxy === "undefined") {
            throw new Error('At least one of sessionId, cookiejar, or proxy parameters must be provided.');
        }

        return this.sendRequest('request.get', 'POST', { url, session: sessionId, cookiejar, proxy });
    }

    /**
   * Sends a POST request through Scrappey.com.
   *
   * @param {string} url - The URL of the website to scrape.
   * @param {string|Object} postData - The data to be sent in the request body. It should be in `application/x-www-form-urlencoded` format.
   * @param {string|null} [sessionId] - The ID of the session to use for the request.
   * @param {Object|null} [cookiejar] - Cookies to be sent with the request.
   * @param {Object|null} [proxy] - Proxy configuration for the request.
   * @returns {Promise<Object>} The response from the POST request.
   * @throws {Error} If the postData is not in `application/x-www-form-urlencoded` format and cannot be converted.
   */
    async postRequest(url, postData, sessionId = null, cookiejar = null, proxy = null) {
        // Check if postData is already in application/x-www-form-urlencoded format
        const isFormData = typeof postData === 'string' && postData.includes('=');

        // If postData is not in the correct format, try to convert it
        let requestData;
        if (!isFormData) {
            try {
                requestData = new URLSearchParams(postData).toString();
            } catch (error) {
                throw new Error('Invalid postData format. It must be in application/x-www-form-urlencoded format.');
            }
        } else {
            requestData = postData;
        }

        // Continue with the rest of the code
        return this.sendRequest('request.post', 'POST', { url, postData: requestData, session: sessionId, cookiejar, proxy });
    }

}

module.exports = Scrappey;
