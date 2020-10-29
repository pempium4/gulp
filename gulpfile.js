const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const gulpAutoPrefix = require('gulp-autoprefixer');
const gulpCleanCSS = require('gulp-clean-css');
const gulpUglify = require('gulp-uglify');
//const gulpTerser = require('gulp-terser');
const del = require('del');
const browserSync = require('browser-sync').create();

const gulpSass = require('gulp-sass');
//const gulpSourceMaps = require('gulp-sourcemaps');

function stylesSCSS(){
    return gulp.src('./SCSS/**/*.scss')
        .pipe(gulpConcat('style.scss'))
        // .pipe(gulpSourceMaps.init())
        .pipe(gulpSass().on('Error', gulpSass.logError))
        // .pipe(gulpSourceMaps.write('./'))
        .pipe(gulpAutoPrefix({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(gulpCleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./Build/'))
        .pipe(browserSync.stream());
}
function scripts(){
    return gulp.src('./JS/**/*.js')
        .pipe(gulpConcat('main.js'))
        .pipe(gulpUglify({
            toplevel: true
        }))
        //or .pipe(gulpTerser()) //supports ES6
        .pipe(gulp.dest('./Build'))
        .pipe(browserSync.stream());
}
function clean(){
    return del(['Build/*']);
}
function watch(){
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./SCSS/**/*.scss', stylesSCSS); //** - любая директория
    gulp.watch('./JS/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

gulp.task('styles', stylesSCSS);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);

//gulp.task('build', gulp.series(del, watch)));