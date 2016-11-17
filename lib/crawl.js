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

    this.request( SteamCrawler.Endpoint.search(parameters), (err, data) => {
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
    if(parameters.responseOnly)
        returnResponseOnly = true;

    this.requestJson( SteamCrawler.Endpoint.searchRender(parameters), (err, data) => {
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
    console.log(SteamCrawler.Endpoint.listings(appID, market_hash_name));
    this.request( SteamCrawler.Endpoint.listings(appID, market_hash_name), (err, data) => {
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

    this.requestJson( SteamCrawler.Endpoint.popular(start, count), (err, data) => {
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

    this.requestJson( SteamCrawler.Endpoint.recent(), (err, data) => {
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

    this.requestJson( SteamCrawler.Endpoint.recentcompleted(), (err, data) => {
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
