"use strict"

module.exports = SteamCrawler;

const Regex = SteamCrawler.Regex = require('../resources/regex');
const Currency = SteamCrawler.Currency = require('../resources/currency');
const Endpoint = SteamCrawler.Endpoint = require('../resources/endpoint');

const request = require('request-promise');

function SteamCrawler(options) {
    options = options || {};

    // Default currrency
    this.currency = options.currency || Currency.USD;
    // Use HTTP/HTTPS proxy to mask requests
    this.proxy = options.proxy || null;
    // Set timeout for requests
    this.timeout = options.timeout || 5000;
    // Set MAX_RETRIES for requests
    this.maxRetries = options.maxRetries || 3;

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

SteamCrawler.prototype.request = (url, retries) => new Promise((Resolve, Reject) => {
    request({
        url: url,
        proxy: this.proxy,
        headers: {
            'accept-charset': 'utf-8'
        },
        timeout: this.timeout
    }).then((body) => {
        // Successful response
        return Resolve(body);
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

        return Reject(reason);
    });
});

SteamCrawler.prototype.requestJson = (url, retries) => new Promise((Resolve, Reject) => {
    request({
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

        return Resolve(body);
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

        return Reject(reason);
    });
});

require('./crawl.js');
