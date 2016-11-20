"use strict"

const cheerio = require('cheerio');

const SteamCrawler = require('./index.js');

const MarketItem = require('./classes/MarketItem');
const MarketListing = require('./classes/MarketListing');
const UserMarketListing = require('./classes/UserMarketListing');

SteamCrawler.prototype.getSearch = function(parameters) {
    const url = this._buildUrl(SteamCrawler.Endpoint.search(parameters));

    return new Promise((Resolve, Reject) => {
        this.request(url).then((data) => {
            let results  = this._seperateListingsFromResultHtml(data);
            let listings = [];

            for(let i in results) {
                listings.push(new MarketListing(results[i]));
            }

            return Resolve(listings);
        }).catch((reason) => {
            return Reject(reason);
        });
    });
}

SteamCrawler.prototype.getSearchRender = function(parameters) {
    let returnResponseOnly = false;
    if(parameters.responseOnly) {
        returnResponseOnly = true;
        delete parameters.responseOnly;
    }

    const url = this._buildUrl(SteamCrawler.Endpoint.searchRender(parameters));

    return new Promise((Resolve, Reject) => {
        this.requestJson(url).then((data) => {
            if( ! returnResponseOnly) {
                let results = this._seperateListingsFromResultHtml(data.results_html);
                let listings = [];

                for(let i in results) {
                    listings.push(new MarketListing(results[i]));
                }

                data = listings;
            }

            return Resolve(data);
        }).catch((reason) => {
            return Reject(reason);
        });
    });
}

SteamCrawler.prototype.getListings = function(appID, market_hash_name, loadAdditionalEndpoints) {
    const url = this._buildUrl(SteamCrawler.Endpoint.listings(appID, market_hash_name));

    return new Promise((Resolve, Reject) => {
        this.request(url).then((data) => {
            const $ = cheerio.load(data);

            return Resolve(new MarketItem($, loadAdditionalEndpoints));
        }).catch((reason) => {
            return Reject(reason);
        });
    });
}

// This function uses another way of getting the listings from results_html
// In this Steam decided to seperate results with arrays, why? idk.
SteamCrawler.prototype.getPopular = function(start, count) {
    const url = this._buildUrl(SteamCrawler.Endpoint.popular(start, count));

    return new Promise((Resolve, Reject) => {
        this.requestJson(url).then((data) => {
            let listings = [];

            for(let i in data.results_html) {
                let $ = cheerio.load(data.results_html[i].toString('utf8'));
                listings.push(new MarketListing($));
            }

            return Resolve(listings);
        }).catch((reason) => {
            return Reject(reason);
        });
    });
}

// TODO: Add "listinginfo" to results
SteamCrawler.prototype.getRecent = function() {
    const url = this._buildUrl(SteamCrawler.Endpoint.recent());

    return new Promise((Resolve, Reject) => {
        this.requestJson(url).then((data) => {
            let results = this._seperateListingsFromResultHtml(data.results_html);
            let listings = [];

            for(let i in results) {
                listings.push(new UserMarketListing(results[i]));
            }

            return Resolve(listings);
        }).catch((reason) => {
            return Reject(reason);
        });
    });
}

SteamCrawler.prototype.getRecentCompleted = function() {
    const url = this._buildUrl(SteamCrawler.Endpoint.recentcompleted());

    return new Promise((Resolve, Reject) => {
        this.requestJson(url).then((data) => {
            let results = this._seperateListingsFromResultHtml(data.results_html);
            let listings = [];

            for(let i in results) {
                listings.push(new UserMarketListing(results[i]));
            }

            return Resolve(listings);
        }).catch((reason) => {
            return Reject(reason);
        });
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
