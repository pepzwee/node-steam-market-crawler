"use strict";

module.exports = UserMarketListing;

const Regex = require('../../resources/regex.js');

const elRow = '.market_listing_row_link';
const elMarketName = '.market_listing_item_name_link';
const elMarketLink = elMarketName;
const elGameName = '.market_listing_game_name';
const elItemImage = 'img.market_listing_item_img';

const elNormalPrice = '.market_listing_price_with_fee';
const elSalePrice = '.market_listing_price_with_publisher_fee_only';

const defaultIconSize = '/62fx62f';

function UserMarketListing($) {
    let url = $(elMarketLink).attr('href');

    this.market_name = $(elMarketName).text();
    this.market_hash_name = this._splitURL(url, 6);
    this.game_name = this.description = $(elGameName).text();

    this.appID = parseInt(this._splitURL(url, 5), 10);
    this.url = url;
    this.image = ($(elItemImage).attr('src')).replace(defaultIconSize, '');

    this.normal_price = parseFloat(($(elNormalPrice).text()).replace('$', ''));
    this.sale_price = parseFloat(($(elSalePrice).text()).replace('$', ''));

    this.border_color = Regex.get(Regex.listings.borderColor, $(elItemImage).attr('style'), 2) || false;
}

UserMarketListing.prototype._splitURL = function(url, index) {
    return decodeURIComponent(url.split('/')[index]).toString('utf8');
}
