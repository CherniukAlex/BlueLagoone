"use strict";

const {src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const panini = require("panini");


/* Paths to source/build/watch files
=========================*/

var path = {
    build: {
        html: "public/",
        js: "public/assets/js/",
        css: "public/assets/css/",
        images: "public/assets/i/",
        fonts: "public/assets/fonts/"
    },
    src: {
        html: ["src/*.{htm,html,php}"],
        htac: ["src/.htaccess"],
        js: "src/assets/js/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/i/**/*.{jpg,png,svg,gif,ico}",
        fonts: "src/assets/fonts/**/*.{ttf,woff,woff2,eot}"
    }
};


/* Tasks
=========================*/

function html() {
    panini.refresh();
    return src(path.src.html, {base: 'src/'})
        .pipe(plumber())
        .pipe(panini({
            root: 'src/',
            layouts: 'src/tpl/layouts/',
            partials: 'src/tpl/partials/',
            helpers: 'src/tpl/helpers/',
            data: 'src/tpl/data/',
        }))
        .pipe(dest(path.build.html));

}

function css() {
    return src(path.src.css, {base: './src/assets/sass/'})
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 8 versions"],
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css));
}

function js() {
    return src(path.src.js, {base: './src/assets/js/'})
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js));
}

function images() {
    return src(path.src.images)
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}


const build = gulp.series(gulp.parallel(html, css, js, images, fonts));


// export tasks
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.default = build;
