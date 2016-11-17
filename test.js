"use strict"

const SteamMarketCrawler = require('./lib/index');

let MarketCrawler = new SteamMarketCrawler();

/*
MarketCrawler.getListings(730, 'AK-47 | Redline (Minimal Wear)', (err, MarketItem) => {
    if(err) {
        console.log(err);
    } else {

        MarketItem.getRecentActivity(function(err, data) {
            console.log(data);
        });

    }
});
*/

/*
MarketCrawler.getSearch({
    appid: 730,
    q: 'PP-Bizon | Harvester'
}, (err, data) => {
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
*/
/*
MarketCrawler.getSearchRender({
    query: "",
    start: 0,
    count: 2,
    search_descriptions: 0,
    sort_column: "name",
    sort_dir: "asc",
    responseOnly: true
}, (err, data) => {
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
*/
//console.log(SteamMarketCrawler.Endpoint.popular(1));

/*
MarketCrawler.request( SteamMarketCrawler.Endpoint.popular(1) , (err, data) => {
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
*/
