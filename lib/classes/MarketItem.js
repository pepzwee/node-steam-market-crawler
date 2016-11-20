"use strict"

module.exports = MarketItem;

const SteamCrawler = require('../index');
const Regex = require('../../resources/regex');
const Elem = require('../../resources/elements').MarketItem;
const Endpoint = require('../../resources/endpoint');
const defaultIconSize = '/360fx360f';

function MarketItem($, loadEndpoints) {
    const scripts = $('body script').eq(3).text().toString('utf8');

    this.url = $( Elem.market_name_alt ).last().attr('href');

    this.market_hash_name = this._splitURL(this.url, 6) || null;
    this.market_name = $( Elem.market_name ).text() || $( Elem.market_name_alt ).last().text() || this.market_hash_name;

    this.nameID = Regex.get( Regex.listings.nameID, scripts, 2) || null;
    this.appID = parseInt( this._splitURL(this.url, 5), 10 );

    let image = $( Elem.image ).first().attr('src');
    if(image) image = image.replace(defaultIconSize, '');
    this.image = image || null;

    this.app_context_data = this.setAppContextData( scripts );
    this.assets = this.setAssets( scripts );
    this.median_sale_prices = this.setMedianSalePrices( scripts );

    this.recent_activity = [];
    this.histogram = [];

    if(loadEndpoints && this.nameID) {
        this.getRecentActivity();
        this.getHistogram();
    }
}

MarketItem.prototype.setAppContextData = function(html) {
    const app_context_data = Regex.get( Regex.listings.appContextData, html, 3, true);
    if( ! app_context_data) return {};
    return app_context_data;
}

MarketItem.prototype.setAssets = function(html) {
    const assets = Regex.get( Regex.listings.assets, html, 3, true);
    if( ! assets) return {};
    return assets;
}

MarketItem.prototype.setMedianSalePrices = function(html) {
    if( ! this.nameID) return [];
    const median_sale_prices = Regex.get( Regex.listings.medianSalePrices, html, 2, true );
    if( ! median_sale_prices) return [];
    return median_sale_prices;
}

MarketItem.prototype.getRecentActivity = function(cached) {
    const self = this;

    return new Promise((resolve, reject) => {
        if( ! this.nameID) return reject('This item does not have `nameID` set.');
        if(cached) return resolve(this.recent_activity);

        const url = SteamCrawler.prototype._buildUrl(Endpoint.itemordersactivity(this.nameID));

        SteamCrawler.prototype.requestJson(url).then((data) => {
            self.recent_activity = data || [];

            resolve(data);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

MarketItem.prototype.getHistogram = function(cached) {
    const self = this;

    return new Promise((resolve, reject) => {
        if( ! this.nameID) return reject('This item does not have `nameID` set.');
        if(cached) return resolve(this.histogram);

        const url = SteamCrawler.prototype._buildUrl(Endpoint.itemordershistogram(this.nameID));

        SteamCrawler.prototype.requestJson(url).then((data) => {
            self.histogram = data || [];

            resolve(data);
        }).catch((reason) => {
        reject(reason);
        });
    });
}

MarketItem.prototype._splitURL = function(url, index) {
    try {
        return decodeURIComponent(url.split('/')[index]).toString('utf8');
    } catch (e) {
        throw new Error('Failed to decodeURI - malformed response?');
    }
}
