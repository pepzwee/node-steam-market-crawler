"use strict";

module.exports = MarketListing;

const Regex = require('../../resources/regex.js');

const elRow = '.market_listing_row_link';
const elMarketName = '.market_listing_item_name';
const elGameName = '.market_listing_game_name';
const elItemImage = 'img.market_listing_item_img';
const elQuantity = '.market_listing_num_listings_qty';

const elNormalPrice = '.normal_price';
const elSalePrice = '.sale_price';

const defaultIconSize = '/62fx62f';

function MarketListing($) {
    let url = $(this).attr('href') || $(elRow).attr('href');

    this.market_name = $(elMarketName).text();
    this.market_hash_name = this._splitURL(url, 6);
    this.game_name = this.description = $(elGameName).text();

    this.appID = parseInt(this._splitURL(url, 5), 10);
    this.url = url;
    this.image = ($(elItemImage).attr('src')).replace(defaultIconSize, '');

    this.quantity = parseInt($(elQuantity).text(), 10);
    this.normal_price = parseFloat(($(elNormalPrice).eq(1).text()).replace('$', ''));
    this.sale_price = parseFloat(($(elSalePrice).text()).replace('$', ''));

    this.border_color = Regex.get(Regex.listings.borderColor, $(elItemImage).attr('style'), 2) || false;
}

MarketListing.prototype._splitURL = function(url, index) {
    return decodeURIComponent(url.split('/')[index]).toString('utf8');
}
