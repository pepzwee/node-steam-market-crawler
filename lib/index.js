"use strict"

module.exports = SteamCrawler;

const Regex = SteamCrawler.Regex = require('../resources/regex');
const Currency = SteamCrawler.Currency = require('../resources/currency');
const Endpoint = SteamCrawler.Endpoint = require('../resources/endpoint');

const request = require('request-promise');

function SteamCrawler(options) {
    options = options || {};

    this.currency = options.currency || Currency.USD;
    this.proxy = options.proxy || false;
    this.webProxy = options.webProxy || false;
}

SteamCrawler.prototype.request = function(url, callback) {
    request({
        url: url,
        proxy: this.proxy,
        headers: {
            'accept-charset': 'utf-8'
        }
    }).then((res) => {
        // Successful Response
        if(typeof callback === "function") return callback(null, res);
    }, (reason) => {
        // Request Failure
        if(typeof callback === "function") return callback(reason);
    });
}

SteamCrawler.prototype.requestJson = function(url, callback) {
    request({
        url: url,
        proxy: this.proxy,
        headers: {
            'accept-charset': 'utf-8'
        }
    }).then((res) => {
        // Successful Response
        let error = null;
        // Try to parse response as JSON
        try {
            res = JSON.parse(res);
        } catch(e) {
            error = 'Not valid JSON.';
        }
        // Check if NULL or has error
        if(error === null && (res === null || res.success === false)) {
            error = 'Received "null" or response success was false.';
        }
        if(typeof callback === "function") return callback(error, res);
    }, (reason) => {
        // Request Failure
        if(typeof callback === "function") return callback(reason);
    });
}

require('./crawl.js');
