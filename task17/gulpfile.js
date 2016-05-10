'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const nib = require('nib');
const runSequence = require('run-sequence');
const postcss = require('gulp-postcss');
const base64 = require('postcss-base64');

gulp.task('server', () => {
    return connect.server({
        port: 3001,
        root: [__dirname]
    });
});

gulp.task('replace-urls', () => {
    return gulp.src('./task17.css')
        .pipe(postcss([
            css => {
                css.replaceValues(/\/images/, () => './images');
            }
        ]))
        .pipe(gulp.dest('./'));
});

gulp.task('svg-to-base64', () => {
    return gulp.src('./task17.css')
        .pipe(postcss([
            base64({
                extensions: ['.svg'],
                pattern: /data:image/i,
                prepend: 'data:image/svg+xml;'
            })
        ]))
        .pipe(gulp.dest('./'));
});

gulp.task('png-to-base64', () => {
    return gulp.src('./task17.css')
        .pipe(postcss([
            base64({
                extensions: ['.png'],
                pattern: /data:image\/(?!svg\+xml)/i,
                prepend: 'data:image/png;'
            })
        ]))
        .pipe(gulp.dest('./'));
});

gulp.task('stylus', () => {
    return gulp.src('./task17.styl')
        .pipe(stylus({
            use: [nib()]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
    watch('./*.styl', () => {
        runSequence('stylus');
    });
});

gulp.task('css', () => {
	return runSequence('stylus', 'replace-urls', 'svg-to-base64', 'png-to-base64');
});

gulp.task('default', ['server', 'css', 'watch']);
