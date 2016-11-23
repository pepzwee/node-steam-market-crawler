'use strict';

const SteamCrawler = require('../index.js');
const Base = require('./Base');

const regex = require('../../resources/regex');

/**
 * This class is for the standard market listings like /search and /popular
 */
class Listing extends Base {
    constructor($) {
        super($);

        const dom = require('../../resources/dom')($);

        // Item border color
        this.border_color = regex.get( regex.listings.borderColor, $( dom.selectors.image[0] ).attr('style'), 2) || null;
        // Amount being sold on the market currently
        this.quantity = parseInt(
            $( dom.selectors.quantity ).text(), 10
        ) || null;
        // Prices
        this.normal_price = dom.normalPrice();
        this.sale_price = dom.salePrice();
    }

    // Loads the listings page for moar data
    listingItem() {
        return SteamCrawler.prototype.getListings(this.appID, this.market_hash_name);
    }
}

// Export Class
module.exports = Listing;
