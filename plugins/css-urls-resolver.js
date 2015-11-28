'use strict';

let path = require('path');
let gutil = require('gulp-util');
let through2 = require('through2');

/**
 * Resolves URLS inside CSS based on `wrap-with-path` plugin
 *
 * @param {String} [base = ''] base path
 * @return {Stream}
 */
function gulpCSSResolver(base) {
    base = path.resolve(process.cwd(), base || '');

    return through2.obj(function (file, encoding, callback) {
        /* begin: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */
        /* end: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */
        let wrapPathRegex = /\/\*\sbegin:\s([^\s]+)\s\*\/([\s\S]+?)\/\*\send:\s([^\s]+)\s\*\//g;
        let originalFileContents = file.contents.toString('utf8');

        // console.log(originalFileContents)
        let changedFileContents = originalFileContents.replace(wrapPathRegex, function (str, beginPath, css, endPath) {
            // begin file path should be equal to end file path
            if (beginPath !== endPath) {
                return str;
            }

            // everything inside url(***)
            return str.replace(/url\(['|"]?(.+?)['|"]?\)/g, function (substr, url) {
                if (url.startsWith('data:') || url.startsWith('//') || /^https?:\/\//.test(url)) {
                    return substr;
                }

                url = path.resolve(path.dirname(beginPath), url);
                return `url("${path.relative(base, url)}")`;
            });
        });

        file.contents = new Buffer(changedFileContents);
        this.push(file);

        callback();
    });
}

module.exports = gulpCSSResolver;
