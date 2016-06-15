'use strict';

let through2 = require('through2');

function getWrappedTemplate(fileContents) {
    return `modules.require('bh', function (bh) {
        var module = {};

        // start
        ${fileContents}
        // and now end

        module.exports && module.exports(bh);
    })`;
}

/**
 * Wraps BH client templates into ymodule wrapper
 *
 * @return {Stream}
 */
function gulpBHClientMatchers() {
    return through2.obj(function (file, encoding, callback) {
        let contents = getWrappedTemplate(file.contents.toString('utf8'));
        file.contents = new Buffer(contents);

        this.push(file);
        callback();
    });
}

module.exports = gulpBHClientMatchers;
