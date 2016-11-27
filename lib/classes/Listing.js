'use strict';

const Base = require('./Base');

/**
 * This class is for the standard market listings like /search and /popular
 */
class Listing extends Base {
    constructor($, parameters, popularity) {
        super($);

        const dom = require('../../resources/dom')($);

        // Item border color
        this.border_color = dom.borderColor();
        // Amount being sold on the market currently
        this.quantity = parseInt(
            $( dom.selectors.quantity ).text(), 10
        ) || 0;
        // Prices
        this.normal_price = dom.normalPrice();
        this.sale_price = dom.salePrice();

        // Add popularity index
        if(popularity.use && parameters) {
            // Add it only when sort_column was set to `popular` and sort direction is descending
            if(parameters.sort_column === 'popular' && parameters.sort_dir === 'desc') {
                this.popularityIndex = parameters.start / popularity.divider;
            }
        }
    }
}

// Export Class
module.exports = Listing;
