'use strict';

module.exports = {
    get: function(regex, string, index, json) {
        let m;
        if((m = regex.exec(string)) !== null) {
            if(m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            let value = null;
            if(typeof m[index] !== 'undefined') value = m[index];
            if(json && value) {
                try { return JSON.parse(value); } catch(e) {
                    // Sometimes my Regex is shit and it is missing an "}" in the end, try to check again
                    value += '}';
                    try { return JSON.parse(value); } catch(e) { return null; }
                }
            }
            return value;
        }
    },
    listings: {
        'appContextData': /(g_rgAppContextData) = ([\"\\']?)(.*?)\};/,
        'assets': /(g_rgAssets) = ([\"\\']?)(.*?)\};/,
        'medianSalePrices': /(line1)\=([^)]+)\;/,
        'nameID': /(Market_LoadOrderSpread)\( ([^)]+) \)/,
        'borderColor': /(border-color: #)([^)]+)\;.?/
    }
}
