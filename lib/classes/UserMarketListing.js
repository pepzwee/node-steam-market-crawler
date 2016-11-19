"use strict";

module.exports = UserMarketListing;

const Regex = require('../../resources/regex.js');
const Elem = require('../../resources/elements.js').UserMarketListing;
const defaultIconSize = '/62fx62f';

function UserMarketListing($) {
    let url = $(Elem.market_link).attr('href');

    this.market_name = $(Elem.market_name).text();
    this.market_hash_name = this._splitURL(url, 6);
    this.game_name = this.description = $(Elem.game_name).text();

    this.appID = parseInt(this._splitURL(url, 5), 10);
    this.url = url;
    this.image = ($(Elem.item_image).attr('src')).replace(defaultIconSize, '');

    this.normal_price = parseFloat(($(Elem.normal_price).text()).replace('$', ''));
    this.sale_price = parseFloat(($(Elem.sale_price).text()).replace('$', ''));

    this.border_color = Regex.get(Regex.listings.borderColor, $(Elem.item_image).attr('style'), 2) || false;
}

UserMarketListing.prototype._splitURL = function(url, index) {
    try {
        return decodeURIComponent(url.split('/')[index]).toString('utf8');
    } catch (e) {
        throw new Error('Failed to decodeURI - malformed response?');
    }
}
