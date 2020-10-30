const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const gulpAutoPrefix = require('gulp-autoprefixer');
const gulpCleanCSS = require('gulp-clean-css');
const gulpUglify = require('gulp-uglify');
// const gulpTerser = require('gulp-terser');
const del = require('del');
const browserSync = require('browser-sync').create();

const gulpSass = require('gulp-sass');
const gulpSourceMaps = require('gulp-sourcemaps');

// const imagemin = require('gulp-imagemin');

const gulpRename = require('gulp-rename');


gulp.task('del', () => {
    return del(['Build/*']);
});
gulp.task('styles', () =>{
    return gulp.src('./SCSS/**/*.scss')
        .pipe(gulpSourceMaps.init()) //для отображения SCSS строк
        .pipe(gulpSass().on('Error', gulpSass.logError))
        .pipe(gulpAutoPrefix({
            cascade: false
        }))
        .pipe(gulpConcat('style.css'))
        .pipe(gulpCleanCSS())
        .pipe(gulpRename({
            suffix: '.min'
        }))
        .pipe(gulpSourceMaps.write('./'))
        .pipe(gulp.dest('./Build/'))
        .pipe(browserSync.stream());
});
gulp.task('scripts', () => {
    return gulp.src('./JS/**/*.js')
        .pipe(gulpConcat('main.js'))
        .pipe(gulpUglify({
            toplevel: true
        }))
        //or .pipe(gulpTerser()) //supports ES6
        .pipe(gulpRename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./Build'))
        .pipe(browserSync.stream());
});
/*gulp.task('img-compress', () =>{
    return gulp.src('./img/!**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./Build/img'))
})*/
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    // gulp.watch('./img/**', gulp.series('img-compress'));
    gulp.watch('./SCSS/**/*.scss', gulp.series('styles')); //** - любая директория
    gulp.watch('./JS/**/*.js', gulp.series('scripts'));
    gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts'), 'watch'));