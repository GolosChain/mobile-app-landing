const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const svgstore = require('gulp-svgstore');
const webp = require('gulp-webp');
const run = require('run-sequence');
const del = require('del');
const webpack = require('webpack-stream');

const syntax = 'sass'; // Syntax: sass or scss;

//image optimization

gulp.task('images', function() {
    return gulp
        .src('img/**/*.{png,jpg,svg}')
        .pipe(
            imagemin([
                imagemin.optipng({ optimizationLevel: 0 }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.svgo({
                    plugins: [{ cleanupIDs: false }],
                }),
            ])
        )
        .pipe(gulp.dest('build/img'));
});

gulp.task('webp', function() {
    return gulp
        .src('img/**/*.{png,jpg}')
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest('build/img'));
});

//svg sprite creating

gulp.task('sprite', function() {
    return gulp
        .src('build/img/**/icon-*.svg')
        .pipe(
            svgstore({
                inlineSvg: true,
            })
        )
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/img/'));
});

// sass to css with minification

gulp.task('styles', function() {
    return gulp
        .src(syntax + '/**/main.' + syntax + '')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: true,
            })
        )
        .pipe(gulp.dest('build/css'))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(
            cleancss({
                level: { 1: { specialComments: 0 } },
                compatibility: 'ie11',
            })
        )
        .pipe(gulp.dest('build/css'));
});

//js optimization

gulp.task('webpack', function() {
    return gulp
        .src('js/input.js')
        .pipe(
            webpack({
                output: {
                    filename: 'scripts.js',
                },
                module: {
                    rules: [
                        {
                            test: /\.(js)$/,
                            exclude: /(node_modules)/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['env'],
                            },
                        },
                    ],
                },
            })
        )
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('clean', () => del('build'));

gulp.task('copy', () => gulp.src('fonts/**/*.{woff,woff2}').pipe(gulp.dest('build/fonts')));

gulp.task('build', function(done) {
    run('clean', 'copy', 'styles', 'webpack', 'images', 'webp', 'sprite', done);
});

//watcher

gulp.task('watch', function() {
    gulp.watch(syntax + '/**/*.' + syntax + '', ['styles']);
    gulp.watch(['libs/**/*.js', 'js/*.js'], ['webpack']);
});

gulp.task('default', ['watch']);
