'use strict';

class Base {

    constructor($) {
        const dom = require('../../resources/dom')($);

        // URL of the item
        this.url = dom.url();
        // Game ID
        this.appID = parseInt(
            this.splitURL(5), 10
        );
        // Which game has this item
        this.game_name = $( dom.selectors.game_name ).first().text() || null;
        // Item names
        this.market_name = dom.marketName() || this.market_hash_name;
        this.market_hash_name = this.splitURL(6);
        // Item image
        this.image = dom.image();
    }

    splitURL(index) {
        try {
            return decodeURIComponent(this.url.split('/')[index]).toString('utf8');
        } catch(e) {
            throw new Error(['Failed to split the URL.']);
        }
    }
}

// Export Class
module.exports = Base;
