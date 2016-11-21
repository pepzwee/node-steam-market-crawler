"use strict";

const SteamCrawler = require('../index');

class Market {

    getAppContextData(scripts) {
        const app_context_data = this.regex().get( this.regex().listings.appContextData, scripts, 3, true);
        if( ! app_context_data) return {};
        return app_context_data;
    }

    getAssets(scripts) {
        const assets = this.regex().get( this.regex().listings.assets, scripts, 3, true);
        if( ! assets) return {};
        return assets;
    }

    getMedianSalePrices(scripts) {
        if( ! this.nameID) return [];
        const median_sale_prices = this.regex().get( this.regex().listings.medianSalePrices, scripts, 2, true );
        if( ! median_sale_prices) return [];
        return median_sale_prices;
    }

    getRecentActivity(nameID, cached) {
        const self = this;

        return new Promise((resolve, reject) => {
            if( ! this.nameID) return reject('This item does not have `nameID` set.');
            if(cached) return resolve(this.recent_activity);

            const url = SteamCrawler.prototype.buildUrl(this.endpoint().itemordersactivity(nameID));

            SteamCrawler.prototype.requestJson(url).then((data) => {
                self.recent_activity = data || [];

                resolve(data);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    getHistogram(nameID, cached) {
        const self = this;

        return new Promise((resolve, reject) => {
            if( ! nameID) return reject('This item does not have `nameID` set.');
            if(cached) return resolve(this.histogram);

            const url = SteamCrawler.prototype.buildUrl(this.endpoint().itemordershistogram(nameID));

            SteamCrawler.prototype.requestJson(url).then((data) => {
                self.histogram = data || [];

                resolve(data);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    splitURL(url, index) {
        try {
            return decodeURIComponent(url.split('/')[index]).toString('utf8');
        } catch(e) {
            throw new Error(['Failed to split the URL.', e, url]);
        }
    }

    regex() {
        return require('../../resources/regex');
    }

    element(item) {
        return require('../../resources/elements')[item];
    }

    endpoint() {
        return require('../../resources/endpoint')
    }

}

module.exports = Market;
