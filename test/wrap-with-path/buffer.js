'use strict';

let path = require('path');
let gutil = require('gulp-util');
let expect = require('chai').expect;

let wrapWithPath = require('../../')['wrap-with-path'];
let File = gutil.File;
let collectStreamFiles = require('../../lib/collect-stream-files');

const SAMPLE_FILE_CONTENTS = '* { margin: 0; }\n';

function resolveFilePath(file) {
    return path.resolve(__dirname, `${file}.css`);
}

function getVinylFile(file) {
    return new File({
        path: resolveFilePath(file),
        contents: new Buffer(SAMPLE_FILE_CONTENTS)
    });
}

function fillInputFiles(files, stream) {
    for (let file of files) {
        let vinylFile = getVinylFile(file);
        stream.write(vinylFile);
    }

    stream.end();
}

describe('wrap-with-path (buffer support)', () => {
    it('should produce expected output', () => {
        let stream = gutil.noop();
        let myPluginStream = wrapWithPath();
        let blocks = ['user', 'award', 'page'];

        // now pipe input files
        fillInputFiles(blocks, myPluginStream);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            expect(files).to.have.length(blocks.length);

            expect(files[0].path).to.equal(resolveFilePath(blocks[0]));
            expect(files[1].path).to.equal(resolveFilePath(blocks[1]));
            expect(files[2].path).to.equal(resolveFilePath(blocks[2]));

            expect(files[0].contents.toString('utf8').startsWith(`/* begin: ${resolveFilePath(blocks[0])} */`)).to.be.true;
            expect(files[0].contents.toString('utf8').endsWith(`/* end: ${resolveFilePath(blocks[0])} */\n`)).to.be.true;
            expect(files[0].contents.toString('utf8')).to.contain(SAMPLE_FILE_CONTENTS);
            expect(files[1].contents.toString('utf8').startsWith(`/* begin: ${resolveFilePath(blocks[1])}`)).to.be.true;
            expect(files[1].contents.toString('utf8').endsWith(`/* end: ${resolveFilePath(blocks[1])} */\n`)).to.be.true;
            expect(files[1].contents.toString('utf8')).to.contain(SAMPLE_FILE_CONTENTS);
            expect(files[2].contents.toString('utf8').startsWith(`/* begin: ${resolveFilePath(blocks[2])}`)).to.be.true;
            expect(files[2].contents.toString('utf8').endsWith(`/* end: ${resolveFilePath(blocks[2])} */\n`)).to.be.true;
            expect(files[2].contents.toString('utf8')).to.contain(SAMPLE_FILE_CONTENTS);
        });
    });
});
