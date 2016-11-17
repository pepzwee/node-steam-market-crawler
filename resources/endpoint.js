"use strict"

// SteamCommunity URL's
const SC  = 'http://steamcommunity.com/';
const SCM = SC + 'market/';
/**
 * This is solely here because of SteamApis.com,
 * it helps our ProxyAPI identify if the loaded page was indeed valid.
 * Feel free to ignore this.
 */
const Contains = {
    web: '33779068',
    json: '"success"'
};

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

        return {
            contains: Contains.web,
            url: `${SCM}search?${parameters}`
        };
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

        return {
            contains: Contains.json,
            url: `${SCM}search/render?${parameters}`
        };
    },
    /**
     * Gets the popular listings
     */
    'popular': function(start, count) {
        return {
            contains: Contains.json,
            url: `${SCM}popular?language=english&currency=1&start=${start}&count=${count}`
        };
    },
    /**
     * Gets the recently created listings
     */
    'recent': function() {
        return {
            contans: Contans.json,
            url: `${SCM}recent?country=US&language=english&currency=1`
        };
    },
    /**
     * Gets the recently completed/sold listings
     */
    'recentcompleted': function() {
        return {
            contains: Contains.json,
            url: `${SCM}recentcompleted`
        };
    },
    /**
     * Gets the listings page using appID and marketHashName
     */
    'listings': function(appID, marketHashName) {
        return {
            contains: Contains.web,
            url: `${SCM}listings/${appID}/${marketHashName}`
        };
    },
    /**
     * Gets the item activity on the listings page
     */
    'itemordersactivity': function(nameID) {
        return {
            contains: Contains.json,
            url: `${SCM}itemordersactivity?language=english&currency=1&item_nameid=${nameID}`
        };
    },
    /**
     * Gets the item sale history on the listings page
     */
    'itemordershistogram': function(nameID) {
        return {
            contains: Contains.json,
            url: `${SCM}itemordershistogram?language=english&currency=1&item_nameid=${nameID}`
        };
    }
};
