'use strict';

let path = require('path');
let gutil = require('gulp-util');
let expect = require('chai').expect;

let gulpConcatBH = require('../');
let File = gutil.File;

function getVinylFile(file) {
    return new File({
        path: `${file}.bh.js`
    });
}

function fillInputFiles(files, stream) {
    for (let file of files) {
        let vinylFile = getVinylFile(file);
        stream.write(vinylFile);
    }

    stream.end();
}

describe('gulp-concat-bh', () => {
    it('should concat files and output expected structure', done => {
        let stream = gutil.noop();
        let myGulpConcatBH = gulpConcatBH('all.bh.js');
        let blocks = ['user', 'award', 'page'];

        // now pipe input files
        fillInputFiles(blocks, myGulpConcatBH);

        myGulpConcatBH.once('data', file => {
            expect(path.basename(file.path)).to.be.equal('all.bh.js');

            let fileContents = file.contents.toString('utf8');
            for (let block of blocks) {
                expect(fileContents).to.contain(`require('${block}.bh.js')(bh);`);
            }

            done();
        });
    });

    it('should use base path to construct result URLs', done => {
        let stream = gutil.noop();
        let myGulpConcatBH = gulpConcatBH('all.bh.js', './relative/path/');
        let blocks = ['user', 'award', 'page'];

        // now pipe input files
        fillInputFiles(blocks, myGulpConcatBH);

        myGulpConcatBH.once('data', file => {
            expect(path.basename(file.path)).to.be.equal('all.bh.js');

            let fileContents = file.contents.toString('utf8');
            for (let block of blocks) {
                expect(fileContents).to.contain(`require('../../${block}.bh.js')(bh);`);
            }

            done();
        });
    });
});
