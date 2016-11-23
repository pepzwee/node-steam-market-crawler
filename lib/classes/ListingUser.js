'use strict';

const SteamCrawler = require('../index.js');
const Base = require('./Base');

/**
 * This class is for the user market listings like /recent and /recentcompleted
 */
class ListingUser extends Base {
    constructor($) {
        super($);

        const dom = require('../../resources/dom')($);
        // Check if item has been sold
        this.isSold = dom.isSold();
        // Seller avatar
        this.sellerAvatar = dom.sellerAvatar();
        // Item border color
        this.border_color = $( dom.selectors.image[0] ).css('border-color') || null;
        // Expect the items to be sold
        this.normal_price = null;
        this.sale_price = null;
        // If the item has not been sold we can get the prices
        if( ! this.isSold) {
            this.normal_price = dom.normalPrice();
            this.sale_price = dom.salePrice();
        }
    }

    // Loads the listings page for moar data
    listingItem() {
        return SteamCrawler.prototype.getListings(this.appID, this.market_hash_name);
    }
}

// Export Class
module.exports = ListingUser;
