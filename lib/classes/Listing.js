'use strict';

const Base = require('./Base');

/**
 * This class is for the standard market listings like /search and /popular
 */
class Listing extends Base {
    constructor($) {
        super($);

        const dom = require('../../resources/dom')($);

        // Item border color
        this.border_color = dom.borderColor();
        // Amount being sold on the market currently
        this.quantity = parseInt(
            $( dom.selectors.quantity ).text(), 10
        ) || null;
        // Prices
        this.normal_price = dom.normalPrice();
        this.sale_price = dom.salePrice();
    }
}

// Export Class
module.exports = Listing;
