'use strict';

let gutil = require('gulp-util');
let through2 = require('through2');

let template = `modules.require('bh', function (bh) {
    var obj = {};

    (function (module) {
        {bh_template}
    })(obj);

    obj.exports && obj.exports(bh);
})`;

/**
 * Wraps BH client templates into ymodule wrapper
 *
 * @return {Stream}
 */
function gulpBHClientMatchers() {
    return through2.obj(function (file, encoding, callback) {
        let contents = template.replace('{bh_template}', file.contents.toString('utf8'));
        file.contents = new Buffer(contents);

        this.push(file);
        callback();
    });
}

module.exports = gulpBHClientMatchers;
