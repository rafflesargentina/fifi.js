'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var fixmyjs = require('gulp-fixmyjs');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function () {
    gulp.src(['src/js/fifi.js'])
        .pipe(jshint())
        .pipe(jshint.reporter( 'jshint-stylish' ))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('fixmyjs', function () {
    gulp.src('src/js/fifi.js')
        .pipe(fixmyjs())
        .pipe(gulp.dest('src/js/'));
});

gulp.task('uglify', function () {
    gulp.src('dist/js/fifi.js')
        .pipe(concat('fifi.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('todo', function() {
    gulp.src('src/js/fifi.js')
        .pipe(plugins.todo())
        .pipe(plugins.todo.reporter('json', {fileName: 'todo.json'}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['lint','fixmyjs','uglify']);
