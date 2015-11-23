'use strict';

let path = require('path');
let gutil = require('gulp-util');
let through2 = require('through2');

let template = `'use strict';
    module.exports = function (BH) {
        var bh = new BH();
        bh.setOptions({
            jsAttrName: 'data-bem',
            jsAttrScheme: 'json'
        });

        {templates}

        return bh;
    };`;

/**
 * Concat BH templates (main exported function)
 *
 * @param {String} file - relative result file name
 * @param {String} [base = ''] base path
 * @return {Stream}
 */
function gulpConcatBH(file, base) {
    let files = [];

    return through2.obj((file, encoding, callback) => {
        files.push(file);
        callback();
    }, function (closeStreamCallback) {
        base = path.resolve(process.cwd(), base || '');

        let templates = files.map(file => {
            return `require('${path.relative(base, file.path)}')(bh);`;
        }).join('\n        ');

        let output = template.replace('{templates}', templates);
        let outputFile = new gutil.File({
            path: file,
            contents: new Buffer(output)
        });

        this.push(outputFile);
        closeStreamCallback();
    });
}

module.exports = gulpConcatBH;
