'use strict';

let gutil = require('gulp-util');
let through2 = require('through2');

let template = `modules.define('bh', {dependencies}, function ({provide}) {
    {bh}

    var bh = new BH();
    bh.setOptions({
        jsAttrName: 'data-bem',
        jsAttrScheme: 'json'
    });

    {provideDeps}

    provide(bh);
})`;

/**
 * Wraps BH engine into ymodule wrapper
 *
 * @return {Stream}
 */
function gulpBHClientEngine(deps) {
    deps = deps || {};

    return through2.obj(function (file, encoding, callback) {
        let engine = file.contents.toString('utf8');
        let realDeps = Object.keys(deps);

        let dependencies = JSON.stringify(realDeps);
        let provide = ['provide'].concat(realDeps).join(', ');

        let provideDeps = realDeps.map(dependency => {
            return `bh.lib.${deps[dependency]} = ${dependency};`
        }).join('\n');

        let output = template
            .replace('{dependencies}', dependencies)
            .replace('{provide}', provide)
            .replace('{bh}', engine)
            .replace('{provideDeps}', provideDeps);

        file.contents = new Buffer(output);
        this.push(file);

        callback();
    });
}

module.exports = gulpBHClientEngine;
