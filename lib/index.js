"use strict"

const Regex = require('../resources/regex');
const Currency = require('../resources/currency');
const Endpoint = require('../resources/endpoint');

const requestp = require('request-promise');
const cheerio = require('cheerio');

class SteamCrawler {
    constructor(options) {
        options = options || {};

        this._cheerio = cheerio;

        // Default currrency
        this.currency = options.currency || Currency.USD;
        // Use HTTP/HTTPS proxy to mask requests
        this.proxy = options.proxy || null;
        // Set timeout for requests
        this.timeout = options.timeout || 5000;
        // Set MAX_RETRIES for requests
        this.maxRetries = options.maxRetries || 3;
        // Regex's
        this.Regex = Regex;
        // Currencies
        this.Currency = Currency;
        // Endpoints
        this.Endpoint = Endpoint;

        /**
         * Mostly options that are necessary for SteamApis,
         * you can safely ignore these.
         */
        // Use WebProxy to proxy the requests
        this.webProxy = options.webProxy || false;
        // Use Base64 encoded strings as URL's where possible,
        // good when using webProxy - other than that pointless.
        this.base64 = options.base64 || false;
        // Base64 prefix
        this.base64Prefix = options.base64Prefix || 'base64';
    }

    request(url, retries) {
        return new Promise((resolve, reject) => {
            requestp({
                url: url,
                proxy: this.proxy,
                headers: {
                    'accept-charset': 'utf-8'
                },
                timeout: this.timeout
            }).then((body) => {
                // Successful response
                return resolve(body);
            }).catch((reason) => {
                // Something went wrong, try again if possible
                if( ! retries) {
                    retries = 0;
                } else {
                    retries++;
                }

                if(retries <= this.maxRetries) {
                    return this.request(url, retries);
                }

                return reject(reason);
            });
        });
    }

    requestJson(url, retries) {
        return new Promise((resolve, reject) => {
            requestp({
                url: url,
                proxy: this.proxy,
                headers: {
                    'accept-charset': 'utf-8'
                },
                timeout: this.timeout
            }).then((body) => {
                // Successful Response
                let error = null;
                // Try to parse response as JSON
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    error = 'Not valid JSON.';
                }

                // Check if NULL or has error
                if(error === null && (body === null || body.success === false)) {
                    error = 'Received "null" or response success was false.';
                }

                if(error) {
                    if( ! retries) {
                        retries = 0;
                    } else {
                        retries++;
                    }

                    if(retries <= this.maxRetries) {
                        return this.requestJson(url, retries);
                    }
                }

                return resolve(body);
            }).catch((reason) => {
                // Request Failure
                if( ! retries) {
                    retries = 0;
                } else {
                    retries++;
                }

                if(retries <= this.maxRetries) {
                    return this.requestJson(url, retries);
                }

                return reject(reason);
            });
        });
    }

}

module.exports = SteamCrawler;

require('./crawl.js');
