"use strict"

module.exports = MarketItem;

const SteamCrawler = require('../index');
const Regex = require('../../resources/regex');
const Endpoint = require('../../resources/endpoint');

const El = {
    market_name: 'h1#largeiteminfo_item_name',
    market_hash_name: '.market_listing_nav a',
    image: '.market_listing_largeimage img'
};

const defaultIconSize = '/360fx360f';

function MarketItem($, loadEndpoints) {
    const scripts = $('body script').eq(3).text().toString('utf8');

    this.market_hash_name = $( El.market_hash_name ).last().text() || null;
    this.market_name = $( El.market_name ).text() || this.market_hash_name;

    this.nameID = Regex.get( Regex.listings.nameID, scripts, 2) || null;
    this.url = $( El.market_hash_name ).last().attr('href');
    this.appID = parseInt( this._splitURL(this.url, 5), 10 );

    let image = $( El.image ).first().attr('src');
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

MarketItem.prototype.getRecentActivity = function(cached, callback) {
    if( ! this.nameID) return callback(new Error('This item has no nameID!'));

    if(typeof cached === "function") {
        callback = cached;
        cached = false;
    }
    if(cached) return callback(null, this.recent_activity);

    let self = this;
    return SteamCrawler.prototype.requestJson( Endpoint.itemordersactivity(this.nameID), (err, data) => {
        self.recent_activity = data;

        if(callback) return callback(err, data);
    });
}

MarketItem.prototype.getHistogram = function(cached, callback) {
    if( ! this.nameID) return callback(new Error('This item has no nameID!'));

    if(typeof cached === "function") {
        callback = cached;
        cached = false;
    }
    if(cached) return callback(null, this.histogram);

    let self = this;
    return SteamCrawler.prototype.requestJson( Endpoint.itemordershistogram(this.nameID), (err, data) => {
        self.histogram = data || [];

        if(callback) return callback(err, data);
    });

}

MarketItem.prototype._splitURL = function(url, index) {
    return decodeURIComponent(url.split('/')[index]).toString('utf8');
}
