'use strict';

const Base = require('./Base');
const regex = require('../../resources/regex');

/**
* This class is for the single market item listing pages like /listings/730/AK-47%20%7C%20Redline%20%28Field-Tested%29
*/
class ListingItem extends Base {
    constructor($) {
        super($);

        const script = $('body script').eq(3).text().toString('utf8');

        // Item unique nameID
        this.nameID = regex.get(regex.listings.nameID, script, 2) || null;

        this.median_sale_prices = this.getMedianSalePrices(script);
        this.assets = this.getAssets(script);
        this.app_context_data = this.getAppContextData(script);

        // Additional data that needs to be loaded in using functions
        this.histogram = [];
        this.recent_activity = [];
    }

    getAppContextData(script) {
        const app_context_data = regex.get( regex.listings.appContextData, script, 3, true);
        if( ! app_context_data) return {};
        return app_context_data;
    }

    getAssets(script) {
        const assets = regex.get( regex.listings.assets, script, 3, true);
        if( ! assets) return {};
        return assets;
    }

    getMedianSalePrices(script) {
        if( ! this.nameID) return [];
        const median_sale_prices = regex.get( regex.listings.medianSalePrices, script, 2, true );
        if( ! median_sale_prices) return [];
        // Fix quantity to integer
        return median_sale_prices.map((array) => {
            return [
                array[0],
                +array[1],
                +array[2]
            ];
        });
    }
}

// Export Class
module.exports = ListingItem;
