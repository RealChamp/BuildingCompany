let gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    babel = require('gulp-babel'),
    htmlmin = require('gulp-htmlmin'),
    stripCssComments = require('gulp-strip-css-comments'),
    stripJsComments = require('gulp-strip-comments'),
    del = require('del');


gulp.task('clean', async function () {
    del.sync('dist')
});

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('style', function () {
    return gulp.src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/slick-carousel/slick/slick.css',

        ])
        .pipe(concat('libs.min.css'))
        .pipe(cssmin())
        .pipe(stripCssComments({
            preserve: false,
        }))
        .pipe(gulp.dest('src/assets/css'))
});

gulp.task('script', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/slick-carousel/slick/slick.js'

        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
});

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('minifyHtml', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "src/"
        },
    });
});


gulp.task('moveAssets', function () {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'))

});


gulp.task('moveJs', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('babel', function () {
    del.sync('dist/js/index.js')
    return gulp.src("src/js/index.js")
        .pipe(babel())
        .pipe(stripJsComments())
        .pipe(gulp.dest("dist/js"));
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'))
    gulp.watch('src/**/*.html', gulp.parallel('html'))
    gulp.watch('src/js/**/*.js', gulp.parallel('js'))
});

gulp.task('default', gulp.parallel('style', 'script', 'sass', 'watch', 'browser-sync'))
gulp.task('build', gulp.parallel('clean', 'minifyHtml', 'moveJs', 'moveAssets'))