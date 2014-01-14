var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zip');

gulp.task('zip', function() {
    gulp.src('src/**')
        .pipe(zip('dogepricer.zip'))
        .pipe(gulp.dest('.'));
});
