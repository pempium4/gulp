const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const gulpAutoPrefix = require('gulp-autoprefixer');
const gulpCleanCSS = require('gulp-clean-css');
const gulpUglify = require('gulp-uglify');
//const gulpTerser = require('gulp-terser');
const del = require('del');
const browserSync = require('browser-sync').create();

const gulpSass = require('gulp-sass');
const gulpSourceMaps = require('gulp-sourcemaps');

const styleFiles = [
    './CSS/main.css',
    './CSS/media.css'
];
const scriptFiles = [
    './JS/lib.js',
    './JS/main.js'
]

function compileSCSS(){
    return gulp.src('./SCSS/**/*.scss')
        .pipe(gulpSourceMaps.init())
        .pipe(gulpSass().on('Error', gulpSass.logError))
        .pipe(gulpSourceMaps.write('./'))
        .pipe(gulp.dest('./CSS/'))
}

function styles(){
    return gulp.src(styleFiles)
        .pipe(gulpConcat('style.css'))
        .pipe(gulpAutoPrefix({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(gulpCleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./Build'))
        .pipe(browserSync.stream());
}
function scripts(){
    return gulp.src(scriptFiles)
        .pipe(gulpConcat('main.js'))
        .pipe(gulpUglify({
            toplevel: true
        }))
        //or .pipe(gulpTerser()) //supports ES6
        .pipe(gulp.dest('./Build'))
        .pipe(browserSync.stream());
}
function clean(){
    return del(['build/*']);
}
function watch(){
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./SCSS/**/*.scss', compileSCSS);
    gulp.watch('./CSS/**/*.css', styles); //** - любая директория
    gulp.watch('./JS/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

gulp.task('compile', compileSCSS);

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('dev', gulp.series('build', 'watch'));