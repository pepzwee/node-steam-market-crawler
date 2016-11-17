module.exports = {
    'USD': 1,
    'GBP': 2,
    'EUR': 3,
    'CHF': 4,
    'RUB': 5,
    'BRL': 7,
    'JPY': 8,
    'SEK': 9,
    'IDR': 10,
    'MYR': 11,
    'PHP': 12,
    'SGD': 13,
    'THB': 14,
    'KRW': 16,
    'TRY': 17,
    'MXN': 19,
    'CAD': 20,
    'NZD': 22,
    'CNY': 23,
    'INR': 24,
    'CLP': 25,
    'PEN': 26,
    'COP': 27,
    'ZAR': 28,
    'HKD': 29,
    'TWD': 30,
    'SRD': 31,
    'AED': 32,

    getCurrencyID: function(currency) {
        return 2000 + currency;
    }
}
