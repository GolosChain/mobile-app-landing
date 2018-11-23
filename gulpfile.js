const syntax = 'sass'; // Syntax: sass or scss;

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    svgstore = require('gulp-svgstore'),
    webp = require('gulp-webp'),
    run = require('run-sequence'),
    del = require('del'),
    webpack = require('webpack-stream'),
    pug = require('gulp-pug'),
    data = require('gulp-data'),
    fs = require('fs');

//server

gulp.task('browser-sync', function() {
    browsersync({
        server: {
            baseDir: 'build',
        },
        notify: false,
        // open: false,
        // tunnel: true,
        // tunnel: "projectname", //Demonstration page: http://projectname.localtunnel.me
    });
});

//image optimization

gulp.task('images', function() {
    return gulp
        .src('src/img/**/*.{png,jpg,svg}')
        .pipe(
            imagemin([
                imagemin.optipng({ optimizationLevel: 3 }),
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
        .src('src/img/**/*.{png,jpg}')
        .pipe(webp({ quality: 75 }))
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
        .src('src/' + syntax + '/**/main.' + syntax + '')
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
        ) // Opt., comment out when debugging
        .pipe(gulp.dest('build/css'))
        .pipe(browsersync.reload({ stream: true }));
});

//js optimization

gulp.task('webpack', function() {
    return gulp
        .src('src/js/input.js')
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
        .pipe(gulp.dest('src/js/'));
});

gulp.task('js', function() {
    return gulp
        .src([
            'src/js/scripts.js', // Always at the end
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify()) // Minify js (opt.)
        .pipe(gulp.dest('build/js'))
        .pipe(browsersync.reload({ stream: true }));
});

gulp.task('clean', function() {
    return del('build');
});

gulp.task('html', function() {
    return gulp
        .src('src/*.pug')
        .pipe(
            data(function(file) {
                return JSON.parse(fs.readFileSync('./src/locales/EN.json'));
            })
        )
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'))
        .pipe(browsersync.reload({ stream: true }));
});

gulp.task('copy', function() {
    return gulp
        .src(['src/fonts/**/*.{woff,woff2}'], {
            base: './src',
        })
        .pipe(gulp.dest('build'));
});

gulp.task('build', function(done) {
    run('clean', 'copy', 'html', 'styles', 'webpack', 'js', 'images', 'webp', 'sprite', done);
});
//watcher

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('src/' + syntax + '/**/*.' + syntax + '', ['styles']);
    gulp.watch(['libs/**/*.js', 'src/js/*.js'], ['webpack']);
    gulp.watch(['src/js/scripts.js'], ['js']);
    gulp.watch('src/*.pug', ['html']);
});

gulp.task('default', ['watch']);
