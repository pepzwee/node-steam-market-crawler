"use strict"

// SteamCommunity URL's
const SC  = 'http://steamcommunity.com/';
const SCM = SC + 'market/';

// Available endpoints
module.exports = {
    /**
     * Search page
     */
    'search': function(object) {
        let parameters = '';

        if(typeof object === 'object') {
            parameters = Object.keys(object).map((key) => {
                return `${key}=${object[key]}`;
            }).join('&');
        }

        return `${SCM}search?${parameters}`;
    },
    /**
     * Search render API
     */
    'searchRender': function(object) {
        let parameters = '';

        // Default search params if object was not set.
        if( ! object) {
            object = {
                query: "",
                start: 0,
                count: 10,
                search_descriptions: 0,
                sort_column: "popular",
                sort_dir: "desc"
            }
        }

        if(typeof object === 'object') {
            parameters = Object.keys(object).map((key) => {
                return `${key}=${object[key]}`;
            }).join('&');
        }

        return `${SCM}search/render?${parameters}`;
    },
    /**
     * Gets the popular listings
     */
    'popular': function(start, count) {
        return SCM + `popular?language=english&currency=1&start=${start}&count=${count}`;
    },
    /**
     * Gets the recently created listings
     */
    'recent': function() {
        return SCM + `recent?country=US&language=english&currency=1`;
    },
    /**
     * Gets the recently completed/sold listings
     */
    'recentcompleted': function() {
        return SCM + `recentcompleted`;
    },
    /**
     * Gets the listings page using appID and marketHashName
     */
    'listings': function(appID, marketHashName) {
        return SCM + `listings/${appID}/${marketHashName}`;
    },
    /**
     * Gets the item activity on the listings page
     */
    'itemordersactivity': function(nameID) {
        return SCM + `itemordersactivity?language=english&currency=1&item_nameid=${nameID}`;
    },
    /**
     * Gets the item sale history on the listings page
     */
    'itemordershistogram': function(nameID) {
        return SCM + `itemordershistogram?language=english&currency=1&item_nameid=${nameID}`;
    }
};
