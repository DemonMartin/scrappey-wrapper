/**
 * @module Scrappey
 */

const axios = require('axios').default;
const countries = require("./countries.json")

/**
 * A class representing the Scrappey library.
 */
class Scrappey {

    /**
    * Represents a proxy country.
    *
    * @typedef {('UnitedStates' | 'Canada' | 'Afghanistan' | 'Albania' | 'Algeria' | 'Argentina' | 'Armenia' | 'Aruba' | 'Australia' | 'Austria' | 'Azerbaijan' | 'Bahamas' | 'Bahrain' | 'Bangladesh' | 'Belarus' | 'Belgium' | 'BosniaandHerzegovina' | 'Brazil' | 'BritishVirginIslands' | 'Brunei' | 'Bulgaria' | 'Cambodia' | 'Cameroon' | 'Canada' | 'Chile' | 'China' | 'Colombia' | 'CostaRica' | 'Croatia' | 'Cuba' | 'Cyprus' | 'Czechia' | 'Denmark' | 'DominicanRepublic' | 'Ecuador' | 'Egypt' | 'ElSalvador' | 'Estonia' | 'Ethiopia' | 'Finland' | 'France' | 'Georgia' | 'Germany' | 'Ghana' | 'Greece' | 'Guatemala' | 'Guyana' | 'HashemiteKingdomofJordan' | 'HongKong' | 'Hungary' | 'India' | 'Indonesia' | 'Iran' | 'Iraq' | 'Ireland' | 'Israel' | 'Italy' | 'Jamaica' | 'Japan' | 'Kazakhstan' | 'Kenya' | 'Kosovo' | 'Kuwait' | 'Latvia' | 'Liechtenstein' | 'Luxembourg' | 'Macedonia' | 'Madagascar' | 'Malaysia' | 'Mauritius' | 'Mexico' | 'Mongolia' | 'Montenegro' | 'Morocco' | 'Mozambique' | 'Myanmar' | 'Nepal' | 'Netherlands' | 'NewZealand' | 'Nigeria' | 'Norway' | 'Oman' | 'Pakistan' | 'Palestine' | 'Panama' | 'PapuaNewGuinea' | 'Paraguay' | 'Peru' | 'Philippines' | 'Poland' | 'Portugal' | 'PuertoRico' | 'Qatar' | 'RepublicofLithuania' | 'RepublicofMoldova' | 'Romania' | 'Russia' | 'SaudiArabia' | 'Senegal' | 'Serbia' | 'Seychelles' | 'Singapore' | 'Slovakia' | 'Slovenia' | 'Somalia' | 'SouthAfrica' | 'SouthKorea' | 'Spain' | 'SriLanka' | 'Sudan' | 'Suriname' | 'Sweden' | 'Switzerland' | 'Syria' | 'Taiwan' | 'Tajikistan' | 'Thailand' | 'TrinidadandTobago' | 'Tunisia' | 'Turkey' | 'Uganda' | 'Ukraine' | 'UnitedArabEmirates' | 'UnitedKingdom' | 'UnitedStates' | 'Uzbekistan' | 'Venezuela' | 'Vietnam' | 'Zambia')} ProxyCountry
    *
    * @description
    * The `proxyCountry` variable is a string that represents a country value from the provided array.
    */

    /**
    * @typedef {Object} Options
    * @property {string} url - The URL of the website to scrape.
    * @property {string|null} [session] - (optional) The ID of the session to use for the request.
    * @property {Array|null} [cookiejar] - (optional) Cookies to be sent with the request.
    * @property {string|null} [proxy] - (optional) Proxy configuration for the request.
    * @property {ProxyCountry|null} [proxyCountry] - (optional) Select the proxyCountry which will be used if no custom proxy is defined.
    * @property {string|null} [autoparse] - (optional) Enables the autoParse feature from scrappey.com.
    * @property {string|null} [properties] - (optional) Required properties when autoParse is enabled.
    * @property {Object|null} [customHeaders] - (optional) Custom headers.
    */

    /**
    * @typedef {Object} createOptions
    * @property {string|null} [proxy] - (optional) Proxy configuration for the request.
    * @property {ProxyCountry|null} [proxyCountry] - (optional) Select the proxyCountry which will be used if no custom proxy is defined.
    */

    /**
     * Create a Scrappey instance.
     * @param {string} apiKey - The API key for authentication.
     * @param {boolean} disableVerboseErrors - Whether Verbose Errors should be disabled.
     */
    constructor(apiKey, disableVerboseErrors = false) {
        if (typeof apiKey === 'undefined' || apiKey.length === 0) {
            throw new Error('apiKey parameter is required.');
        }

        this.apiKey = apiKey;
        this.disableVerboseErrors = disableVerboseErrors;
        this.baseUrl = 'https://publisher.scrappey.com/api/v1';
    }
    /**
     * 
     * @param {string} endpoint 
     * @param {Options} data 
     * @returns 
     */
    isValidRequest(endpoint = "", data = {}) {

        let sessionEndpoints = ["sessions.create", "sessions.destroy"];
        let requestEndpoints = ["request.get", "request.post"];
        let validEndpoints = [...sessionEndpoints, ...requestEndpoints];

        // Validation is seperated into different parts.

        // [1] Validate values which need to be checked on all Endpoints
        if (!validEndpoints.includes(endpoint)) {
            throw new Error(`Invalid endpoint. Valid endpoints are: ${validEndpoints.join(", ")}`);
        }

        // Validate the proxy
        if (typeof data?.proxy !== "undefined") {
            if (typeof data?.proxy !== "string") {
                throw new Error("proxy parameter must be a string.");
            }

            let validProxyStarts = ["socks4://", "socks5://", "http://", "https://"];
            if (!validProxyStarts.some(start => data.proxy.toLowerCase().startsWith(start))) {
                throw new Error(`Proxy must start with: ${validProxyStarts.join(", ")}`);
            }


            if (typeof data.proxyCountry !== "undefined") {
                if (!this.disableVerboseErrors)
                    console.warn("The 'data.proxy' property is defined. As a result, the 'data.proxyCountry' property will be ignored by scrappey.com.");
            }
        }

        if (typeof data?.proxyCountry !== "undefined") {
            if (!countries.includes(data?.proxyCountry)) {
                throw new Error(`Invalid proxyCountry. Valid proxyCountries are: ${countries.join(", ")}`);
            }
        }

        // data.cmd should not be defined since the parameter endpoint already exists.
        if (typeof data?.cmd !== "undefined") {
            if (!this.disableVerboseErrors)
                console.warn("The 'data.cmd' property is defined. The selected endpoint will be overwritten, which invalidates the validation performed by the wrapper. Please do not define the endpoint in the data.");
        }

        // End of [1]

        // [2] Validation which only needs to be done on requests
        if (requestEndpoints.includes(endpoint)) {
            if (typeof data === "undefined") {
                throw new Error("data parameter is required.");
            }

            if (typeof data?.url !== "string") {
                throw new Error("url parameter is required.");
            }

            if (typeof data?.autoparse != "undefined") {
                if (typeof data?.autoparse !== "boolean") {
                    throw new Error("autoparse parameter must be a boolean.");
                }

                if (data.autoparse === true && typeof data?.properties === "undefined") {
                    throw new Error("properties parameter is required when autoparse is enabled.");
                }

                if (typeof data?.properties !== "string") {
                    throw new Error("properties parameter must be a string.");
                }
            }

            if (typeof data?.customHeaders !== "undefined") {
                if (typeof data?.customHeaders !== "object") {
                    throw new Error("customHeaders parameter must be an object.");
                }
            }

            if (typeof data?.session !== "undefined") {
                if (typeof data?.session !== "string") {
                    throw new Error("session parameter must be a string.");
                }
            }

            if (typeof data?.cookiejar !== "undefined") {
                // This throws error if non valid.
                this.validCookies(data?.cookiejar);
            }
        }

        // End of [2]

        // [3] Validation which only needs to be done on sessions
        if (sessionEndpoints.includes(endpoint)) {
            if (typeof data !== "undefined") {
                if (typeof data?.session !== "undefined") {
                    if (typeof data?.session !== "string") {
                        throw new Error("session parameter must be a string.");
                    }
                }
            }
        }

        // End of [3]

        return true;
    }

    /**
     * Sends a request to Scrappey.com API.
     * Not all validation is performed here. 
     * Additional endpoint-specific validation is conducted in the corresponding function. 
     * Therefore, it is recommended to utilize the corresponding function instead of directly invoking 'sendRequest'.
     *
     * @param {string} endpoint - The endpoint for the request.
     * @param {Options} [data] - The request payload.
     * @returns {Promise<Object>} The response from the request.
     * @throws {Error} If the request fails.
     * @private
     */
    async sendRequest(endpoint, data = {}) {

        // This modification is necessary because the wrapper previously required a "sessionId" String instead of the "session" key as specified in the scrappey.com documentation, will be removed in feature.
        if (typeof data?.sessionId === "string") {
            data.session = data.sessionId;
            data.sessionId = undefined;
        }

        this.isValidRequest(endpoint, data);

        const url = `${this.baseUrl}?key=${this.apiKey}`;

        const options = {
            url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                cmd: endpoint,
                ...data
            }
        };

        try {
            const response = await axios(options, { timeout: 5 * 60 * 1000 });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
    * Validates an array of cookies.
    * 
    * @param {Array<Object>} cookies - The cookies to validate.
    * @returns {boolean} - A Promise that resolves to true if the cookies are valid.
    * @throws {Error} - If the cookies are invalid.
    */
    validCookies(cookies) {
        /**
         * Cookies must look like this:
         * [{"name": "cookie1", "value": "value1", "domain": "domain.com", "path": "/"},
         *  {"name": "cookie2", "value": "value2", "domain": "domain.com", "path": "/"}]
         */
        if (!Array.isArray(cookies)) {
            throw new Error("Cookies must be an array, check https://wiki.scrappey.com/ for examples how to use cookies.");
        }

        if (cookies.length === 0) {
            throw new Error("Cookies should not be empty if defined.");
        }

        if (cookies.some(cookie => typeof cookie !== "object")) {
            throw new Error("Cookies must be an array of objects.");
        }

        if (cookies.some(cookie => typeof cookie.name !== "string")) {
            throw new Error("All cookies must have a name property.");
        }

        if (cookies.some(cookie => typeof cookie.value !== "string")) {
            throw new Error("All cookies must have a value property which is a string.");
        }

        if (cookies.some(cookie => typeof cookie.domain !== "string")) {
            throw new Error("All cookies must have a domain property.");
        }

        if (cookies.some(cookie => typeof cookie.path !== "string")) {
            throw new Error("All cookies must have a path property.");
        }

        return true;
    }


    /**
    * Creates a new browser session.
    *
    * @param {createOptions} options - The options for creating a session.
    * @returns {Promise<Object>} The response from the request.
    */
    async createSession(options = {}) {
        return this.sendRequest('sessions.create', { ...options });
    }


    /**
     * Destroys a browser session.
     *
     * @param {string} session - The ID of the session to destroy.
     * @returns {Promise<Object>} The response from the request.
     */
    async destroySession(session) {
        if (typeof session === 'undefined') {
            throw new Error('session parameter is required.');
        }

        return this.sendRequest('sessions.destroy', { session });
    }

    /**
     * Checks whether the given data is a valid JSON string or object.
     * @param {string|object} data - The data to be checked.
     * @returns {boolean} - A boolean indicating whether the data is valid JSON.
     */
    isJSON(data) {
        if (typeof data === "object") {
            return true;
        } else {
            try {
                JSON.parse(data);
                return true;
            } catch (error) {
                return false;
            }
        }
    }
    /**
    * Checks whether the given data is in valid form data format.
    * @param {string} data - The data to be checked.
    * @returns {boolean} - A boolean indicating whether the data is valid form data.
    */
    isFormData(data) {
        try {
            if (typeof data !== 'string') {
                return false;
            }

            if (!data.includes('=')) {
                return false;
            }

            const pairs = data.split('&');

            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const keyValue = pair.split('=');

                if (keyValue.length !== 2) {
                    return false;
                }

                const key = decodeURIComponent(keyValue[0]);
                const value = decodeURIComponent(keyValue[1]);

                if (key === '' || value === '') {
                    return false;
                }
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Sends a GET request through Scrappey.com.
     *
     * @param {Options} options - The options for the GET request.
     * @returns {Promise<Object>} The response from the request.
     */
    async getRequest(options) {
        return this.sendRequest('request.get', {
            ...options
        });
    }



    /**
     * Sends a POST request through Scrappey.com.
     *
     * @param {Options} options - The options for the POST request.
     * @returns {Promise<Object>} The response from the POST request.
     */
    async postRequest(options) {
        if (typeof options?.postData !== "undefined") {
            if (typeof options?.postData === "object") {
                options.postData = JSON.stringify(options.postData);
            }

            // We should only check the postData if its length is not zero and it is of type string. This way, users can also send a value of "no postData" if desired.
            if (typeof options?.postData === "string" && options?.postData?.length != 0) {
                if (!this.isJSON(options?.postData) && !this.isFormData(options?.postData)) {
                    throw new Error("postData must be in JSON or FormData (application/x-www-form-urlencoded) format.");
                }
            }

            if (typeof options?.postData != "string") {
                throw new Error("postData must be a string.");
            }
        } else {
            // We could also make postData default to empty String here.
            // However, if users make a mistake, like misspelling postData or naming it differently (e.g., PostData), the request will still be sent without any postData.
            // This behavior is not something the wrapper should do as it may lead to unexpected outcomes.
            throw new Error("postData is required. Send empty String if you want to send no postData.");
        }

        // If Users forget to give that content-type but data is json, it will be added automatically.
        if (this.isJSON(options.postData)) {
            let jsonpostData = JSON.parse(options.postData)

            if (!Object.keys(jsonpostData).map(key => key.toLowerCase()).includes("content-type")) {
                options.postData = JSON.stringify({ ...jsonpostData, "content-type": "application/json" })
            }
        }

        return this.sendRequest('request.post', {
            ...options
        });
    }
}

module.exports = Scrappey;
