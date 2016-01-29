'use strict';

let gutil = require('gulp-util');
let through2 = require('through2');

function getPrefixString(filePath) {
    return `/* begin: ${filePath} */\n`;
}

function getPostfixString(filePath) {
    return `/* end: ${filePath} */\n`;
}

/**
 * Wraps file content stream with prefix and postfix
 *
 * @param {Vinyl} file
 * @return {Stream}
 */
function wrapFileContentsStream(file) {
    const outputStream = through2();

    outputStream.write(getPrefixString(file.path));
    file.contents.pipe(outputStream);

    process.nextTick(() => {
        outputStream.write(getPostfixString(file.path));
    });

    return outputStream;
}

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
            file.contents = wrapFileContentsStream(file);
        } else {
            file.contents = Buffer.concat([
                new Buffer(getPrefixString(file.path)),
                file.contents,
                new Buffer(getPostfixString(file.path))
            ]);
        }

        this.push(file);
        callback();
    });
}

module.exports = wrapWithPath;
