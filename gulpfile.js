'use strict';

const gulp    = require('gulp');
const jasmine = require('gulp-jasmine');

gulp.task('test', () => {
    return gulp.src('spec/**/*Spec.js')
               .pipe(jasmine());
});

gulp.task('default', ['test']);
