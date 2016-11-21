"use strict";

const Market = require('./Market')

class Listing extends Market {

    constructor($) {
        super();

        const element = super.element('MarketListing');
        const regex   = super.regex();

        this.url = $(this).attr('href') || $( element.row ).attr('href');
        this.market_name = $( element.market_name ).text();
        this.market_hash_name = super.splitURL(this.url, 6);

        this.game_name = this.description = $( element.game_name ).text();
        this.appID = parseInt(super.splitURL(this.url, 5), 10);

        let image = $( element.item_image ).attr('src');
        if(image) image = image.replace(this.defaultIconSize, '');
        this.image = image || null;

        this.quantity = parseInt($( element.quantity ).text(), 10);
        this.normal_price = parseFloat(($( element.normal_price ).eq(1).text()).replace('$', ''));
        this.sale_price = parseFloat(($( element.sale_price ).text()).replace('$', ''));

        this.border_color = regex.get(regex.listings.borderColor, $( element.item_image ).attr('style'), 2) || false;

        this.defaultIconSize = '/62fx62f';
    }

}

module.exports = Listing;
