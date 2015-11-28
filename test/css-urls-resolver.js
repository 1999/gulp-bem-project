'use strict';

let path = require('path');
let gutil = require('gulp-util');
let expect = require('chai').expect;

let cssResolver = require('../')['css-urls-resolver'];
let File = gutil.File;
let collectStreamFiles = require('../lib/collect-stream-files');

const SIMPLE_CSS = `/* begin: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */
    * { margin: 0; }
    /* end: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */`;

const CSS_CONTAINS_URLS = `/* begin: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */
    * { background: url(sample.png) 0 0 no-repeat; }
    .clearfix { clear: both; }
    /* end: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */
    /* begin: /home/username/work/kinopoisk/app/blocks/award/award.scss */
    .award_oscar { background-image: url(oscar.png) }
    .award_cannes { background-image: none; }
    /* end: /home/username/work/kinopoisk/app/blocks/award/award.scss */`;

const SVG = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIxMXB4IiBoZWlnaHQ9IjZweCIgdmlld0JveD0iMCAwIDExIDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDExIDYiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwb2x5Z29uIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBwb2ludHM9IjEwLjMxMiwwIDUuNSw0LjY2NiAwLjY4OCwwIDAsMC42NjcgNS41LDYgMTEsMC42NjcgCQkiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K';
const CSS_CONTAINS_HTTP_URLS = `/* begin: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */
    .clearfix { background: url(sample.png) 0 0 no-repeat; }
    .clearfix__base64 { background: url("${SVG}"); }
    .clearfix__https { background: url(https://example.com/sample.png); }
    .clearfix__protocol-independent { background: url(//yastatic.net/sample.png); }
    /* end: /home/username/work/kinopoisk/app/bower_components/bem-core/common.blocks/clearfix/clearfix.css */`;

function pipeInputFile(stream, css) {
    let vinylFile = new File({
        contents: new Buffer(css)
    });

    stream.write(vinylFile);
    stream.end();
}

describe('css-urls-resolver', () => {
    it('should produce expected output', () => {
        let stream = gutil.noop();
        let myPluginStream = cssResolver();

        // pipe CSS contents
        pipeInputFile(myPluginStream, SIMPLE_CSS);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            expect(files).to.have.length(1);
            expect(files[0].contents.toString('utf8')).to.equal(SIMPLE_CSS);
        });
    });

    it('should resolve URLs within different files inside concatenated one', () => {
        let stream = gutil.noop();
        let myPluginStream = cssResolver('/home/username/work/kinopoisk/app/build/');

        // pipe CSS contents
        pipeInputFile(myPluginStream, CSS_CONTAINS_URLS);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            let fileContents = files[0].contents.toString('utf8');

            expect(fileContents).to.contain('url("../bower_components/bem-core/common.blocks/clearfix/sample.png")');
            expect(fileContents).to.contain('url("../blocks/award/oscar.png")');
        });
    });

    it('should skip data: and HTTP URLs resolving', () => {
        let stream = gutil.noop();
        let myPluginStream = cssResolver('/home/username/work/kinopoisk/app/build/');

        // pipe CSS contents
        pipeInputFile(myPluginStream, CSS_CONTAINS_HTTP_URLS);

        // run test when stream got all files
        return collectStreamFiles(myPluginStream).then(files => {
            let fileContents = files[0].contents.toString('utf8');

            expect(fileContents).to.contain('url("../bower_components/bem-core/common.blocks/clearfix/sample.png")');
            expect(fileContents).to.contain('url(https://example.com/sample.png)');
            expect(fileContents).to.contain('url(//yastatic.net/sample.png)');
            expect(fileContents).to.contain(`url("${SVG}")`);
        });
    });
});
