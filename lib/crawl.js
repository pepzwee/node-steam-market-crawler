"use strict"

const Promise = require('bluebird');
const cheerio = require('cheerio');

let SteamCrawler = require('./index.js');

const MarketItem = require('./classes/MarketItem');
const MarketListing = require('./classes/MarketListing');
const UserMarketListing = require('./classes/UserMarketListing');

SteamCrawler.prototype.getSearch = function(parameters, callback) {
    const self = this;

    if(typeof parameters === "function") {
        callback = parameters;
        parameters = false;
    }

    const url = this._buildUrl(SteamCrawler.Endpoint.search(parameters));
    this.request(url, (err, data) => {
        if(err) {
            return callback(err);
        } else {
            let results = this._seperateListingsFromResultHtml(data);
            let listings = [];

            for(let i in results) {
                listings.push(new MarketListing(results[i]));
            }

            return callback(null, listings);
        }
    });
}

SteamCrawler.prototype.getSearchRender = function(parameters, callback) {
    const self = this;

    if(typeof parameters === "function") {
        callback = parameters;
        parameters = false;
    }

    let returnResponseOnly = false;
    if(parameters.responseOnly) {
        returnResponseOnly = true;
        delete parameters.responseOnly;
    }

    const url = this._buildUrl(SteamCrawler.Endpoint.searchRender(parameters));
    this.requestJson(url, (err, data) => {
        if(err) {
            return callback(err);
        } else {
            if( ! returnResponseOnly) {
                let results = this._seperateListingsFromResultHtml(data.results_html);
                let listings = [];

                for(let i in results) {
                    listings.push(new MarketListing(results[i]));
                }

                return callback(null, listings);
            }

            return callback(null, data);
        }
    });
}

SteamCrawler.prototype.getListings = function(appID, market_hash_name, callback) {
    const url = this._buildUrl(SteamCrawler.Endpoint.listings(appID, market_hash_name));
    this.request(url, (err, data) => {
        if(err) {
            return callback(err);
        } else {
            const $ = cheerio.load(data);
            return callback(null, new MarketItem($));
        }
    });
}

// This function uses another way of getting the listings from results_html
// In this Steam decided to seperate results with arrays, why? idk.
SteamCrawler.prototype.getPopular = function(start, count, callback) {
    const url = this._buildUrl(SteamCrawler.Endpoint.popular(start, count));
    this.requestJson(url, (err, data) => {
        if(err) {
            return callback(err);
        } else {
            let listings = [];

            for(let i in data.results_html) {
                let $ = cheerio.load(data.results_html[i].toString('utf8'));
                listings.push(new MarketListing($));
            }

            return callback(null, listings);
        }
    });

}

// TODO: Add "listinginfo" to results
SteamCrawler.prototype.getRecent = function(callback) {
    const self = this;

    const url = this._buildUrl(SteamCrawler.Endpoint.recent());
    this.requestJson(url, (err, data) => {
        if(err) {
            return callback(err);
        } else {
            let results = this._seperateListingsFromResultHtml(data.results_html);
            let listings = [];

            for(let i in results) {
                listings.push(new UserMarketListing(results[i]));
            }

            return callback(null, listings);
        }
    });
}

SteamCrawler.prototype.getRecentCompleted = function(callback) {
    const self = this;

    const url = this._buildUrl(SteamCrawler.Endpoint.recentcompleted());
    this.requestJson(url, (err, data) => {
        if(err) {
            return callback(err);
        } else {
            let results = this._seperateListingsFromResultHtml(data.results_html);
            let listings = [];

            for(let i in results) {
                listings.push(new UserMarketListing(results[i]));
            }

            return callback(null, listings);
        }
    });
}

SteamCrawler.prototype._seperateListingsFromResultHtml = function(html) {
    let $ = cheerio.load(html.toString('utf8'));
    let results = [];

    let selector = '.market_listing_row';
    if($('.market_listing_row_link').length) selector = '.market_listing_row_link';

    $(selector).each((index, element) => {
        results.push(cheerio.load(element));
    });

    return results;
}

SteamCrawler.prototype._buildUrl = function(Endpoint) {
    // Check if we need to use base64 or default url
    const URL = (this.base64 && Endpoint.base64) ? this.base64Prefix + Endpoint.base64 : Endpoint.url;
    // Check if webProxy was specified
    if(this.webProxy) {
        return `${this.webProxy}&contains=${Endpoint.contains}&url=${URL}`;
    }
    // No webProxy - return default url
    return Endpoint.url;
}
