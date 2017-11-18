'use strict';

const Base = require('./Base');

/**
 * This class is for the user market listings like /recent and /recentcompleted
 */
class ListingUser {
    constructor(listing, assets) {

        Object.assign(this, listing)

        this.assetinfo = assets[this.asset.appid][this.asset.contextid][this.asset.id]

    }
}

// Export Class
module.exports = ListingUser;
