'use strict';

const cheerio = require('cheerio');

/**
 * This class is to format the histogam data. We don't want any HTML
 */
class Histogram {
    constructor(data) {
        this.sell_order_array = this.histogramTableToArray(data.sell_order_table);
        this.sell_order_summary = this.histogramSummary(data.sell_order_summary);
        this.buy_order_array = this.histogramTableToArray(data.buy_order_table);
        this.buy_order_summary = this.histogramSummary(data.buy_order_summary);
        this.highest_buy_order = parseInt(data.highest_buy_order, 10) || 0;
        this.lowest_sell_order = parseInt(data.lowest_sell_order, 10) || 0;

        this.buy_order_graph = data.buy_order_graph;
        this.sell_order_graph = data.sell_order_graph;

        this.graph_max_y = data.graph_max_y;
        this.graph_min_x = data.graph_min_x;
        this.graph_max_x = data.graph_max_x;
        this.price_prefix = data.price_prefix;
        this.price_suffix = data.price_suffix;
    }

    histogramTableToArray(html) {
        if( ! html || html === '') {
            return [];
        }
        let $ = cheerio.load(html);
        let values = [];
        $('tr').each((index, element) => {
            if($(element).find('td').length) {
                values.push({
                    price: parseFloat($(element).find('td').eq(0).text().replace('$', '').replace(' or less', '').replace(' or more', '')),
                    quantity: parseInt($(element).find('td').eq(1).text(), 10)
                });
            }
        });
        return values;
    }

    histogramSummary(html) {
        if( ! html || html === '' || html.indexOf('no active') !== -1) {
            return {
                price: 0,
                quantity: 0
            }
        }
        let $ = cheerio.load(html);
        return {
            price: parseFloat($('span').eq(1).text().replace('$', '')),
            quantity: parseInt($('span').eq(0).text())
        }
    };
}

// Export Class
module.exports = Histogram;
