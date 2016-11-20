const SteamMarketCrawler = require('../lib/index'); // require('node-steam-market-crawler');
const MarketCrawler = new SteamMarketCrawler();

// getSearch
MarketCrawler.getSearch({
    appid: 730,
    q: 'PP-Bizon | Harvester'
}).then((listings) => {
    console.log(listings);
}).catch((reason) => {
    console.log(reason);
});

// getSearchRender
MarketCrawler.getSearchRender({
    start: 0,
    count: 1
}).then((listings) => {
    console.log(listings);
}).catch((reason) => {
    console.log(reason);
});

// getListings
MarketCrawler.getListings(730, 'AK-47 | Redline (Field-Tested)').then((listing) => {
    console.log(listing);
    // getHistogram
    listing.getHistogram().then((histogram) => {
        console.log(histogram);
        // console.log(listing.histogram);
    }).catch((reason) => {
        console.log(reason);
    });
}).catch((reason) => {
    console.log(reason);
});

// getPopular
MarketCrawler.getPopular(0, 10).then((listings) => {
    console.log(listings);
}).catch((reason) => {
    console.log(reason);
});

// getRecent
MarketCrawler.getRecent().then((listings) => {
    console.log(listings);
}).catch((reason) => {
    console.log(reason);
});

// getRecentCompleted
MarketCrawler.getRecentCompleted().then((listings) => {
    console.log(listings);
}).catch((reason) => {
    console.log(reason);
});
