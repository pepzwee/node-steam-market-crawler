"use strict";

module.exports = MarketListing;

const Regex = require('../../resources/regex');
const Elem = require('../../resources/elements').MarketListing;
const defaultIconSize = '/62fx62f';

function MarketListing($) {
    let url = $(this).attr('href') || $(Elem.row).attr('href');

    this.market_name = $(Elem.market_name).text();
    this.market_hash_name = this._splitURL(url, 6);
    this.game_name = this.description = $(Elem.game_name).text();

    this.appID = parseInt(this._splitURL(url, 5), 10);
    this.url = url;

    let image = $(Elem.item_image).attr('src');
    if(image) image = image.replace(defaultIconSize, '');
    this.image = image || null;

    this.quantity = parseInt($(Elem.quantity).text(), 10);
    this.normal_price = parseFloat(($(Elem.normal_price).eq(1).text()).replace('$', ''));
    this.sale_price = parseFloat(($(Elem.sale_price).text()).replace('$', ''));

    this.border_color = Regex.get(Regex.listings.borderColor, $(Elem.item_image).attr('style'), 2) || false;
}

MarketListing.prototype._splitURL = function(url, index) {
    try {
        return decodeURIComponent(url.split('/')[index]).toString('utf8');
    } catch (e) {
        throw new Error('Failed to decodeURI - malformed response?');
    }
}
