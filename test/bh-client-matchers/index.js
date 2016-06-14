'use strict';

let fs = require('fs');
let path = require('path');
let gutil = require('gulp-util');
let expect = require('chai').expect;

let bhClientMatchers = require('../../')['bh-client-matchers'];
let File = gutil.File;
let collectStreamFiles = require('../../lib/collect-stream-files');
const specialCharactersTemplate = fs.readFileSync(path.join(__dirname, 'special-characters.js'), {encoding: 'utf8'});

function clientTemplate(bh) {
    bh.match('block', function (ctx, json) {
        ctx.content(json.text, true);
    });
}

function resolveFilePath(file) {
    return path.resolve(__dirname, `${file}.bh.js`);
}

function getVinylFile(file) {
    return new File({
        path: resolveFilePath(file),
        contents: new Buffer(clientTemplate + '')
    });
}

function fillInputFiles(files, stream) {
    for (let file of files) {
        let vinylFile = getVinylFile(file);
        stream.write(vinylFile);
    }

    stream.end();
}

describe('bh-client-matchers', () => {
    it('should produce expected output', () => {
        let myPluginStream = bhClientMatchers();
        let blocks = ['user', 'award', 'page'];

        // now pipe input files
        fillInputFiles(blocks, myPluginStream);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            expect(files).to.have.length(blocks.length);

            expect(files[0].path).to.equal(resolveFilePath(blocks[0]));
            expect(files[1].path).to.equal(resolveFilePath(blocks[1]));
            expect(files[2].path).to.equal(resolveFilePath(blocks[2]));

            expect(files[0].contents.toString('utf8').startsWith('modules.require(\'bh\', function (bh) {')).to.be.true;
            expect(files[0].contents.toString('utf8')).to.contain(clientTemplate + '');
            expect(files[1].contents.toString('utf8').startsWith('modules.require(\'bh\', function (bh) {')).to.be.true;
            expect(files[1].contents.toString('utf8')).to.contain(clientTemplate + '');
            expect(files[2].contents.toString('utf8').startsWith('modules.require(\'bh\', function (bh) {')).to.be.true;
            expect(files[2].contents.toString('utf8')).to.contain(clientTemplate + '');
        });
    });

    it('should work with special characters', () => {
        let myPluginStream = bhClientMatchers();
        const vinylFile = new File({
            path: resolveFilePath('block'),
            contents: new Buffer(specialCharactersTemplate)
        });

        myPluginStream.write(vinylFile);
        myPluginStream.end();

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            expect(files).to.have.length(1);

            const contents = files[0].contents.toString('utf8');
            const matches = contents.match(/\}\)\(obj\)/g);
            expect(matches).to.have.length(1);
        });
    });
});
