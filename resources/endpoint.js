'use strict';

// SteamCommunity URL's
const SC = 'http://steamcommunity.com/';
const SCM = SC + 'market/';
/**
 * This is solely here because of SteamApis.com,
 * it helps our ProxyAPI identify if the loaded page was indeed valid.
 * Feel free to ignore this.
 */
const Contains = {
    web: 'g_steamID',
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

        return new function() {
            this.contains = Contains.web;
            this.url = `${SCM}search?${parameters}&l=english`;
            this.base64 = new Buffer(this.url).toString('base64');
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
                query: '',
                start: 0,
                count: 10,
                search_descriptions: 0,
                sort_column: 'popular',
                sort_dir: 'desc'
            }
        }

        if(typeof object === 'object') {
            parameters = Object.keys(object).map((key) => {
                return `${key}=${object[key]}`;
            }).join('&');
        }

        return new function() {
            this.contains = Contains.json;
            this.url = `${SCM}search/render?${parameters}`;
            this.base64 = new Buffer(this.url).toString('base64');
        };
    },
    /**
     * Gets the popular listings
     */
    'popular': function(start, count) {
        return new function() {
            this.contains = Contains.json;
            this.url = `${SCM}popular?language=english&currency=1&start=${start}&count=${count}`;
            this.base64 = new Buffer(this.url).toString('base64');
        };
    },
    /**
     * Gets the recently created listings
     */
    'recent': function() {
        return new function() {
            this.contains = Contains.json;
            this.url = `${SCM}recent?country=US&language=english&currency=1`;
            this.base64 = new Buffer(this.url).toString('base64');
        };
    },
    /**
     * Gets the recently completed/sold listings
     */
    'recentcompleted': function() {
        return new function() {
            this.contains = Contains.json;
            this.url = `${SCM}recentcompleted`;
        };
    },
    /**
     * Gets the listings page using appID and marketHashName
     */
    'listings': function(appID, marketHashName) {
        return new function() {
            this.contains = Contains.web;
            this.url = `${SCM}listings/${appID}/${encodeURIComponent(marketHashName)}?l=english`;
            this.base64 = new Buffer(this.url).toString('base64');
        };
    },
    /**
     * Gets the item activity on the listings page
     */
    'itemordersactivity': function(nameID) {
        return new function() {
            this.contains = Contains.json;
            this.url = `${SCM}itemordersactivity?language=english&currency=1&item_nameid=${nameID}`;
            this.base64 = new Buffer(this.url).toString('base64');
        };
    },
    /**
     * Gets the item sale history on the listings page
     */
    'itemordershistogram': function(nameID) {
        return new function() {
            this.contains = Contains.json;
            this.url = `${SCM}itemordershistogram?language=english&currency=1&item_nameid=${nameID}`;
            this.base64 = new Buffer(this.url).toString('base64');
        };
    }
};
