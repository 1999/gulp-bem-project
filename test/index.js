'use strict';

let path = require('path');
let gutil = require('gulp-util');
let expect = require('chai').expect;

let gulpConcatBH = require('../');
let File = gutil.File;
let template = require('../lib/template');

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

        // now pipe input files
        fillInputFiles(['user', 'award', 'page'], myGulpConcatBH);

        myGulpConcatBH.once('data', file => {
            expect(path.basename(file.path)).to.be.equal('all.bh.js');

            let expectedFileContents = template([
                getVinylFile('user'),
                getVinylFile('award'),
                getVinylFile('page')
            ]);

            expect(file.contents.toString('utf8')).to.equal(expectedFileContents);
            done();
        });
    });
});
