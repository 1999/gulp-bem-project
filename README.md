# gulp-bem-project

[![Greenkeeper badge](https://badges.greenkeeper.io/1999/gulp-bem-project.svg)](https://greenkeeper.io/)

[![Build Status](https://img.shields.io/travis/1999/gulp-bem-project.svg?style=flat)](https://travis-ci.org/1999/gulp-bem-project)
[![Dependency Status](http://img.shields.io/david/1999/gulp-bem-project.svg?style=flat)](https://david-dm.org/1999/gulp-bem-project#info=dependencies)
[![DevDependency Status](http://img.shields.io/david/dev/1999/gulp-bem-project.svg?style=flat)](https://david-dm.org/1999/gulp-bem-project#info=devDependencies)

Gulp plugins for modern BEM projects.

# Install

```
npm install gulp-bem-project --save-dev
```

# Basic Usage
## Concatenate BH server templates
Concats BH template files into one. Emits one JS file which exports a function. This function takes BH engine object as the only parameter.

```javascript
'use strict';

let gulp = require('gulp');
let concatBH = require('gulp-bem-project')['bh-server-concat'];

gulp.task('bh-server', () => {
    gulp
        .src([
            'app/blocks/**/*.bh.js',
            'app/blocks/**/*.bh.server.js'
        ])
        // first argument is result relative file path
        // second argument is base path (optional)
        .pipe(concatBH('combined.bh.js', './relative/path/to/your/app'))
        .pipe(gulp.dest("./"));
});
```

## Get YModule-wrapped BH engine
```javascript
'use strict';

let gulp = require('gulp');
let clientBHEngine = require('gulp-bem-project')['bh-client-engine'];

gulp.task('bh-engine', () => {
    gulp
        .src('node_modules/bh/lib/bh.js')
        // first and only argument is object with dependencies
        // it is optional
        .pipe(clientBHEngine({i18n: 'i18n'}))
        .pipe(gulp.dest("./"));
});
```

## Get YModule-wrapped BH templates
```javascript
'use strict';

let gulp = require('gulp');
let clientBHMatchers = require('gulp-bem-project')['bh-client-matchers'];

gulp.task('bh-client', ['bh-engine'], () => {
    gulp
        .src('app/blocks/**/*.bh.client.js')
        .pipe(clientBHMatchers())
        .pipe(concat('all.bh.client.js'))
        .pipe(gulp.dest("./"));
});
```

## Wrap files' contents into multiline comments with file path
```javascript
'use strict';

let gulp = require('gulp');
let wrapWithPath = require('gulp-bem-project')['wrap-with-path'];

gulp.task('css', () => {
    gulp
        .src('app/blocks/**/*.css')
        .pipe(wrapWithPath())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./'));
});

// all.css will contain something like:
/* begin: /home/user/www/project-name/app/blocks/award/award.css */
// ...selectors here...
/* end: /home/user/www/project-name/app/blocks/award/award.css */

/* begin: /home/user/www/project-name/app/blocks/user/user.css */
// ...selectors here...
/* end: /home/user/www/project-name/app/blocks/user/user.css */

/* begin: /home/user/www/project-name/app/blocks/wrapper/wrapper.css */
// ...selectors here...
/* end: /home/user/www/project-name/app/blocks/wrapper/wrapper.css */
```

## Resolves URLs inside CSS based on `wrap-with-path` plugin
```javascript
'use strict';

let gulp = require('gulp');
let wrapWithPath = require('gulp-bem-project')['wrap-with-path'];
let cssResolver = require('gulp-bem-project')['css-urls-resolver'];
let sass = require('gulp-sass');

gulp.task('css', ['bh-engine'], () => {
    gulp
        .src('app/blocks/**/*.scss')
        .pipe(wrapWithPath())
        .pipe(concat())
        .pipe(sass())
        .pipe(cssResolver())
        .pipe(gulp.dest("./"));
});
```
