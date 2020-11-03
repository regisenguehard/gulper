const { src, dest, watch, task } = require('gulp');
const sass = require('gulp-sass');
const csscomb = require('gulp-csscomb');
const cssbeautify = require('gulp-cssbeautify');
//const autoprefixer = require('gulp-autoprefixer');    // génère un warning
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');  // minify js
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// Variables de chemins
let source = './src'; // dossier de travail
let destination = './dist'; // dossier à livrer



function build(cb) {
    // body omitted
    css();
    js();
    img()
    cb();
}


function css() {
    return src(source + '/assets/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(csscomb())
        .pipe(cssbeautify({ indent: '  ' }))
//        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(dest(destination + '/assets/css/'));
}
function js() {
    return src(source + '/assets/js/*.js')
        .pipe(uglify())
        .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(dest(destination + '/assets/js/'));
}
function img() {
    return src(source + '/assets/img/*.{png,jpg,jpeg,gif,svg}')
        .pipe(imagemin())
        .pipe(dest(destination + '/assets/img/'));
}
/*
function minify() {
    return src(destination + '/assets/css/*.css')
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest(destination + '/assets/css/'));
}
*/
exports.build = build;
exports.default = build;

exports.css = css;
exports.default = css;

exports.js = js;
exports.default = js;

exports.img = img;
exports.default = img;

//exports.watch.description = "Recompile à la volée tous les fichiers";
exports.build.description = exports.default.description = "Compile tous les fichiers (CSS, JS, images)";
exports.css.description = "Compile en css les fichiers scss";
exports.js.description = "Compile les fichiers JavaScript";
exports.img.description = "Réduit le poids des images";


task('watch', function () {
    watch(source + '/assets/css/style.scss', {
        events: 'all', ignoreInitial: false
    }, function (cb) {
        css();
        cb();
    });
    watch(source + '/assets/js/*.js', function (cb) {
        js();
        cb();
    });
    watch(source + '/assets/img/*', function (cb) {
        img();
        cb();
    });
});
