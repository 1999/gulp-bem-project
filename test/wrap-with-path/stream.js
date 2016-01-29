'use strict';

let path = require('path');
let gutil = require('gulp-util');
let through2 = require('through2');
let expect = require('chai').expect;

let wrapWithPath = require('../../')['wrap-with-path'];
let File = gutil.File;
let collectStreamFiles = require('../../lib/collect-stream-files');

const SAMPLE_FILE_CONTENTS = '* { margin: 0; }\n';

function resolveFilePath(file) {
    return path.resolve(__dirname, `${file}.css`);
}

function getStream() {
    const stream = through2();
    stream.write(SAMPLE_FILE_CONTENTS);
    return stream;
}

function getVinylFile(file) {
    return new File({
        path: resolveFilePath(file),
        contents: getStream()
    });
}

function fillInputFiles(files, stream) {
    for (let file of files) {
        let vinylFile = getVinylFile(file);
        stream.write(vinylFile);
    }

    stream.end();
}

function readFromStream(stream) {
    return stream.read().toString('utf8');
}

describe('wrap-with-path (streams support)', () => {
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

            const contents0 = readFromStream(files[0].contents);
            expect(contents0.startsWith(`/* begin: ${resolveFilePath(blocks[0])} */`)).to.be.true;
            expect(contents0.endsWith(`/* end: ${resolveFilePath(blocks[0])} */\n`)).to.be.true;
            expect(contents0).to.contain(SAMPLE_FILE_CONTENTS);

            const contents1 = readFromStream(files[1].contents);
            expect(contents1.startsWith(`/* begin: ${resolveFilePath(blocks[1])}`)).to.be.true;
            expect(contents1.endsWith(`/* end: ${resolveFilePath(blocks[1])} */\n`)).to.be.true;
            expect(contents1).to.contain(SAMPLE_FILE_CONTENTS);

            const contents2 = readFromStream(files[2].contents);
            expect(contents2.startsWith(`/* begin: ${resolveFilePath(blocks[2])}`)).to.be.true;
            expect(contents2.endsWith(`/* end: ${resolveFilePath(blocks[2])} */\n`)).to.be.true;
            expect(contents2).to.contain(SAMPLE_FILE_CONTENTS);
        });
    });
});
