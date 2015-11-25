'use strict';

let gutil = require('gulp-util');
let through2 = require('through2');

const PLUGIN_NAME = 'gulp-bem-project => wrap-with-path';

/**
 * Wraps file contents with comments with file path
 *
 * @return {Stream}
 */
function wrapWithPath() {
    return through2.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new gutil.PluginError(PLUGIN_NAME, 'Streaming is not supported'));
            return;
        }

        file.contents = Buffer.concat([
            new Buffer(`/* begin: ${file.path} */\n`),
            file.contents,
            new Buffer(`/* end: ${file.path} */\n`)
        ]);

        this.push(file);
        callback();
    });
}

module.exports = wrapWithPath;
