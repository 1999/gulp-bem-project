'use strict';

let gutil = require('gulp-util');
let through2 = require('through2');
let template = require('./lib/template');

/**
 * Concat BH templates (main exported function)
 *
 * @param {String} file - relative result file name
 * @return {Stream}
 */
function gulpConcatBH(file) {
    let files = [];

    return through2.obj((file, encoding, callback) => {
        files.push(file);
        callback();
    }, function (closeStreamCallback) {
        let output = template(files);
        let outputFile = new gutil.File({
            path: file,
            contents: new Buffer(output)
        });

        this.push(outputFile);
        closeStreamCallback();
    });
}

module.exports = gulpConcatBH;
