'use strict';

const _ = require('lodash');

module.exports = function($) {
    let dom = {};

    dom.selectors = {
        row: '.market_listing_row_link',
        market_name: [
            '.market_listing_item_name',
            '.market_listing_item_name_link',
            'h1#largeiteminfo_item_name',
            '.market_listing_nav a:last'
        ],
        market_link: [
            '.market_listing_item_name_link',
            '.market_listing_nav a'
        ],
        game_name: '.market_listing_game_name',
        image: [
            'img.market_listing_item_img',
            '.market_listing_largeimage img'
        ],
        quantity: '.market_listing_num_listings_qty',
        normal_price: [
            '.normal_price',
            '.market_listing_price_with_fee'
        ],
        sale_price: [
            '.sale_price',
            '.market_listing_price_with_publisher_fee_only'
        ],
        sellerAvatar: '.playerAvatar img'
    };

    dom.url = function() {
        // All possible matches
        const elements = [
            $( this ).attr('href'),
            $( dom.selectors.row ).attr('href'),
            $( dom.selectors.market_link[0] ).attr('href'),
            $( dom.selectors.market_link[1] ).last().attr('href')
        ];

        // Return a match that is not false nor undefined
        return _.find(elements, (element) => {
            return element !== false && typeof element !== 'undefined';
        });
    };

    dom.marketName = function() {
        // Find a possible match from array
        for(let i in dom.selectors.market_name) {
            let element = dom.selectors.market_name[i];
            // Cheerio does not support ":last" and ":first" at the moment so we have to use .first() and .last()
            if(element.indexOf(':') !== -1) {
                element = element.split(':');
                let selector = $(element[0])[element[1]](); // element[1] is either "first" or "last"
                // Check if it exists and has any content
                if(selector.length && selector.text().trim().length >= 1) {
                    return selector.text();
                }
            } else {
                // Check if exists and has any content
                if($(element).length && $(element).text().trim().length >= 1) {
                    return $(element).text();
                }
            }
        }
        // We did not find a match for market_name
        return false;
    };

    dom.image = function() {
        // All possible matches
        const elements = [
            $( dom.selectors.image[0] ).attr('src'),
            $( dom.selectors.image[1] ).first().attr('src')
        ];

        // Return a match that is not false nor undefined
        let image = _.find(elements, (element) => {
            return element !== false && typeof element !== 'undefined';
        });

        if( ! image) {
            return null;
        }

        // Remove icon size
        return image.replace('/62fx62f', '').replace('/360fx360f', '');
    };

    dom.isSold = function() {
        // All possible matches
        const elements = [
            $( dom.selectors.normal_price[0] ).eq(1).text(),
            $( dom.selectors.normal_price[1] ).text()
        ];

        let isSold = _.find(elements, (element) => {
            return element !== false && typeof element !== 'undefined';
        });

        // Item has been sold already
        if(isSold.indexOf('Sold!') !== -1) {
            return true;
        }
        // Not sold yet
        return false;
    };

    dom.sellerAvatar = function() {
        return $( dom.selectors.sellerAvatar ).attr('src') || null;
    };

    dom.normalPrice = function() {
        // All possible matches
        const elements = [
            $( dom.selectors.normal_price[0] ).eq(1).text(),
            $( dom.selectors.normal_price[1] ).text()
        ];

        let normalPrice = _.find(elements, (element) => {
            return element !== false && typeof element !== 'undefined';
        });

        return parseFloat(normalPrice.replace('$', ''));
    };

    dom.salePrice = function() {
        // All possible matches
        const elements = [
            $( dom.selectors.sale_price[0] ).text(),
            $( dom.selectors.sale_price[1] ).text()
        ];

        let salePrice = _.find(elements, (element) => {
            return element !== false && typeof element !== 'undefined';
        });

        return parseFloat(salePrice.replace('$', ''));
    };

    return dom;
}
