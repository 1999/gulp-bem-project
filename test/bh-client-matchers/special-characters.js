'use strict';

module.exports = function (bh) {
    var ESCAPE_REGEX_SYMBOLS = ['.', '\\', '+', '*', '?', '[', '^', ']', '$', '(', ')', '{', '}', '=', '!', '<', '>', '|', ':', '-'];

    bh.match({
        'input__suggest-item': function (ctx, json) {
            return ESCAPE_REGEX_SYMBOLS;
        }
    });
};
