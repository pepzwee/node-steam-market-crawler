"use strict";

const SteamCrawler = require('../index');
const Market = require('./Market');

class Item extends Market {

    constructor($, loadEndpoints) {
        super();

        const scripts = $('body script').eq(3).text().toString('utf8');
        const element = super.element('MarketItem');
        const regex   = super.regex();

        this.url = $( element.market_name_alt ).last().attr('href');
        this.nameID = regex.get( regex.listings.nameID, scripts, 2) || null;

        this.market_hash_name = super.splitURL(this.url, 6) || null;
        this.market_name = $( element.market_name ).text() || $( element.market_name_alt ).last().text() || this.market_hash_name;
        this.appID = parseInt( super.splitURL(this.url, 5), 10 );

        let image = $( element.image ).first().attr('src');
        if(image) image = image.replace(this.defaultIconSize, '');
        this.image = image || null;

        this.app_context_data = super.getAppContextData( scripts );
        this.assets = super.getAssets( scripts );
        this.median_sale_prices = super.getMedianSalePrices( scripts );

        this.recent_activity = [];
        this.histogram = [];

        if(loadEndpoints && this.nameID) {
            super.getRecentActivity(this.nameID).then((activity) => {
                this.recent_activity = activity;
            });
            super.getHistogram(this.nameID).then((histogram) => {
                this.histogram = histogram;
            });
        }

        this.defaultIconSize = '/360fx360f';
    }

}

module.exports = Item;
