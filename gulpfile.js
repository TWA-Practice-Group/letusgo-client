'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

// var jade = require('gulp-jade');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('less_compiler', function () {

    return  gulp.src('app/styles/**/*.less')
        .pipe($.less())
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('react_compiler', function() {

    browserify(['./app/scripts/main.js'])
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./.tmp/scripts'));
});

gulp.task('jade_compiler', function(){

    return gulp.src('./app/**/*.jade')
        .pipe($.jade())
        .pipe(gulp.dest('./.tmp/'))
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['jade_compiler', 'react_compiler', 'less_compiler'], function () {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp', 'app'],
            routes: {
                '/node_modules': 'node_modules',
                '/images': 'images'
            }
        }
    });

    gulp.watch([
        'app/*.html',
        'app/scripts/**/*.js',
        'app/styles/**/*.less',
        'app/**/*.jade'
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.less', ['less_compiler']);
    gulp.watch('app/scripts/**/*.js',['react_compiler']);
    gulp.watch('app/**/*.jade', ['jade_compiler'])
});


gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
