// 引入 gulp及组件
var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var usemin = require('gulp-usemin');
var $ = require("gulp-load-plugins")();
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var exec = require('child_process').exec;

// 把sass编译成css(在当前文件夹)
var scssSrc = './client/**/*.scss',
    cssDst = './dist/client/app';

gulp.task('styles', function () {
    gulp.src(scssSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client'))
});

var jsSrc = './client/app/**/*.js';
gulp.task('js', function () {
    gulp.src(jsSrc)
        .pipe(jshint())       // 进行检查
        .pipe(jshint.reporter('default'));
});

// 图片压缩
gulp.task('static', function () {
    var staticSrc = './client/static/**',
        staticDst = './dist/client/static';
    gulp.src(staticSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(staticDst));
})

// 清空图片、样式、js
gulp.task('clean', function (cb) {
    gulp.src(['./dist/**'], {read: false})
        .pipe(clean({force: true}));
    cb();
});

//  把css js引入到页面 (app bower)
gulp.task('add', function () {
    var target = gulp.src('./client/index.html');
    target
        .pipe(wiredep())
        .pipe(inject(gulp.src(['./client/app/**/*.js', './client/app/**/*.css'], {read: false}), {
            transform: function (filepath) {
                var ext = filepath.split('.').splice(-1)[0];
                if (ext == 'js') {
                    filepath = filepath.replace('/client/', '');
                    return '<script src="' + filepath + '"></script>';
                }
                if (ext == 'css') {
                    filepath = filepath.replace('/client/', '');
                    return '<link rel="stylesheet" href="' + filepath + '">';
                }
            }
        }))
        .pipe(gulp.dest('./client'));
})


//  把html引用的css和js压缩到目标文件压缩并引用 放到dist
gulp.task('usemin', ['styles', 'add', 'js', 'static'], function () {
    return gulp.src('./client/index.html')
        .pipe($.usemin({
            cssVendor: [$.minifyCss(), $.rev()],
            cssApp: [$.minifyCss(), $.rev()],
            jsVendor: [$.uglify(), $.rev()],
            jsApp: [$.uglify(), $.rev()]
        }))
        .pipe(gulp.dest('dist/client'));
});

// 监听任务
gulp.task('watch', function () {
    gulp.watch('client/**/*', ['styles', 'add']);
});

// dist
gulp.task('dist', ['usemin'], function () {
    return gulp.src('./server/**/*')
        .pipe(gulp.dest('./dist/server'));
})
