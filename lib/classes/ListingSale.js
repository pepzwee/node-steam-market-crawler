'use strict';

/**
 * This class is for the user sales @ market listing page
 */
class ListingSale {
    constructor($, listingInfo) {
        const dom = require('../../resources/dom')($);
        // Sale listing id
        this.id = this.listing_id = $('.market_listing_row').eq(0).attr('id').replace('listing_', '') || null;
        // Item image
        this.image = dom.image();
        // Item names
        this.market_name = dom.marketName();
        // Which game has this item
        this.game_name = $( dom.selectors.game_name ).first().text() || null;
        // Seller avatar
        this.sellerAvatar = dom.sellerAvatar();
        // Item border color
        this.border_color = dom.borderColor();
        // Sale prices
        this.normal_price = dom.normalPrice();
        this.sale_price = dom.salePrice();
        // listinginfo if possible
        if(this.id) {
            this.listinginfo = listingInfo[this.id];
        }
    }
}

// Export Class
module.exports = ListingSale;
