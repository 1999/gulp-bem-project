# gulp-concat-bh

[![Build Status](https://img.shields.io/travis/1999/gulp-concat-bh.svg?style=flat)](https://travis-ci.org/1999/gulp-concat-bh)
[![Dependency Status](http://img.shields.io/david/1999/gulp-concat-bh.svg?style=flat)](https://david-dm.org/1999/gulp-concat-bh#info=dependencies)
[![DevDependency Status](http://img.shields.io/david/dev/1999/gulp-concat-bh.svg?style=flat)](https://david-dm.org/1999/gulp-concat-bh#info=devDependencies)

Gulp plugin which concats BH template files into one.

# Install

```
npm install gulp-concat-bh --save-dev
```

# Basic Usage

```javascript
'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let concatBH = require('gulp-concat-bh');

gulp.task('bh-server', () => {
    gulp
        .src([
            'app/blocks/**/*.bh.js',
            'app/blocks/**/*.bh.server.js'
        ])
        .pipe(concatBH('combined.bh.js', './relative/path/to/process/cwd'))
        .pipe(gulp.dest("./"));
});
```

## Options
First argument is result relative file path. Second argument is base path (optional).
