'use strict';

let path = require('path');
let gutil = require('gulp-util');
let expect = require('chai').expect;

let gulpBHEngine = require('../')['bh-client-engine'];
let File = gutil.File;
let collectStreamFiles = require('../lib/collect-stream-files');

function pipeEngineFile(stream) {
    let vinylFile = new File({
        path: path.resolve(__dirname, 'bh.js'),
        contents: new Buffer('')
    });

    stream.write(vinylFile);
    stream.end();
}

describe('bh-client-engine', () => {
    it('should produce expected output', () => {
        let stream = gutil.noop();
        let myPluginStream = gulpBHEngine();

        // pipe engine file into plugin
        pipeEngineFile(myPluginStream);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            // plugin accepts only one file - BH engine
            expect(files).to.have.length(1);

            let ymoduleContents = files[0].contents.toString('utf8');

            expect(ymoduleContents.startsWith('modules.define(\'bh\', ')).to.be.true;
            expect(ymoduleContents).to.contain('provide(bh);');
        });
    });

    it('should support dependencies passing', () => {
        let stream = gutil.noop();
        let myPluginStream = gulpBHEngine({bar: 'foo', i18n: 'i18n'});

        // pipe engine file into plugin
        pipeEngineFile(myPluginStream);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            let ymoduleContents = files[0].contents.toString('utf8');
            let firstLine = ymoduleContents.split('\n')[0];

            expect(firstLine).to.equal('modules.define(\'bh\', ["bar","i18n"], function (provide, bar, i18n) {');
            expect(ymoduleContents).to.contain('bh.lib.foo = bar;');
            expect(ymoduleContents).to.contain('bh.lib.i18n = i18n;');
        });
    });
});
