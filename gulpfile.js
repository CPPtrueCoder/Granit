

const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imageMin = require('gulp-imagemin');
const notify = require('gulp-notify');
const del = require('del');
const gulp        = require('gulp');
var reload      = browserSync.reload;

function serverTask() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
     
        port: 3000,
        open: true,
        notify: false
    });
    gulp.watch("*.html").on("change", reload);

}

function sassTask() {
    return src('src/sass/**/*.sass')
        .pipe(sass().on("error", notify.onError()))
        .pipe(autoprefixer(['last 15 version']))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function imagesTask() {
    return src('src/img/**/*')
        .pipe(imageMin([
            imageMin.jpegtran({
                progressive: true
            }),
            imageMin.optipng({
                optimizationLevel: 5
            })
        ]))
        .pipe(dest('dist/img'))
}

function watchTask() {
    watch('src/sass/**/*.sass', parallel(sassTask));
    watch('src/js/**/*.js', parallel(scriptsTask));
    watch('src/img/**/*', browserSync.reload);
    watch("src/img/*.html").on("change", reload);
}

function scriptsTask() {
    return src([
        
        'src/js/script.js'
    ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function delTask() {
    return del(['dist']);
}

function buildTask() {
    return src([
        'src/**/*.html',
        'src/**/*.min.js',
        'src/**/*.css'
    ])
        .pipe(dest('dist'))
}

exports.del = delTask;
exports.scripts = scriptsTask;
exports.sass = sassTask;
exports.images = imagesTask;
exports.watch = watchTask;
exports.server = serverTask;


exports.default = series(delTask, scriptsTask, sassTask, imagesTask, buildTask);
