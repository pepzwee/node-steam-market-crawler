'use strict'

const SteamCrawler = require('./index.js');

const Listing = require('./classes/Listing');
const ListingUser = require('./classes/ListingUser');
const ListingItem = require('./classes/ListingItem');

SteamCrawler.prototype.getSearch = function(parameters) {
    const url = this.buildUrl(this.Endpoint.search(parameters));

    return new Promise((resolve, reject) => {
        this.request(url).then((data) => {
            let results = this.seperateListingsFromHTML(data);
            let listings = [];

            for(let i in results) {
                listings.push(new Listing(results[i]));
            }

            resolve(listings);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

SteamCrawler.prototype.getSearchRender = function(parameters) {
    let returnResponseOnly = false;
    if(parameters.responseOnly) {
        returnResponseOnly = true;
        delete parameters.responseOnly;
    }

    const url = this.buildUrl(this.Endpoint.searchRender(parameters));

    return new Promise((resolve, reject) => {
        this.requestJson(url).then((data) => {
            if( ! returnResponseOnly) {
                let results = this.seperateListingsFromHTML(data.results_html);
                let listings = [];

                for(let i in results) {
                    listings.push(new Listing(results[i]));
                }

                data = listings;
            }

            resolve(data);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

SteamCrawler.prototype.getListings = function(appID, market_hash_name, loadAdditionalEndpoints) {
    const url = this.buildUrl(this.Endpoint.listings(appID, market_hash_name));

    return new Promise((resolve, reject) => {
        this.request(url).then((data) => {
            const $ = this._cheerio.load(data);

            resolve(new ListingItem($, loadAdditionalEndpoints));
        }).catch((reason) => {
            reject(reason);
        });
    });
}

// This function uses another way of getting the listings from results_html
// In this Steam decided to seperate results with arrays, why? idk.
SteamCrawler.prototype.getPopular = function(start, count) {
    const url = this.buildUrl(this.Endpoint.popular(start, count));

    return new Promise((resolve, reject) => {
        this.requestJson(url).then((data) => {
            let listings = [];

            for(let i in data.results_html) {
                let $ = this._cheerio.load(data.results_html[i].toString('utf8'));
                listings.push(new Listing($));
            }

            resolve(listings);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

// TODO: Add "listinginfo" to results
SteamCrawler.prototype.getRecent = function() {
    const url = this.buildUrl(this.Endpoint.recent());

    return new Promise((resolve, reject) => {
        this.requestJson(url).then((data) => {
            let results = this.seperateListingsFromHTML(data.results_html);
            let listings = [];

            for(let i in results) {
                listings.push(new ListingUser(results[i]));
            }

            resolve(listings);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

SteamCrawler.prototype.getRecentCompleted = function() {
    const url = this.buildUrl(this.Endpoint.recentcompleted());

    return new Promise((resolve, reject) => {
        this.requestJson(url).then((data) => {
            let results = this.seperateListingsFromHTML(data.results_html);
            let listings = [];

            for(let i in results) {
                listings.push(new ListingUser(results[i]));
            }

            resolve(listings);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

SteamCrawler.prototype.buildUrl = function(endpoint) {
    // Check if we need to use base64 or default url
    const URL = (this.base64 && endpoint.base64) ? this.base64Prefix + endpoint.base64 : endpoint.url;
    // Check if webProxy was specified
    if(this.webProxy) {
        return `${this.webProxy}&contains=${endpoint.contains}&url=${URL}`;
    }
    // No webProxy - return default url
    return endpoint.url;
}

SteamCrawler.prototype.seperateListingsFromHTML = function(html) {
    const $ = this._cheerio.load(html.toString('utf8'));
    let results = [];

    let selector = '.market_listing_row';
    if($('.market_listing_row_link').length) {
        selector = '.market_listing_row_link';
    }

    $(selector).each((index, element) => {
        results.push(this._cheerio.load(element));
    });

    return results;
}
