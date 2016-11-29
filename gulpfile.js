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
var angularTemplates = require('gulp-angular-templates');
var exec = require('child_process').exec;
var browserSync = require('browser-sync').create();

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


// 把html模板打包
gulp.task('templates', function () {
    return gulp.src(['./client/app/**/*.html', './client/widgets/**/*.html'])
        .pipe(angularTemplates({module: 'h5editorMis', basePath: 'app/'}))
        .pipe(gulp.dest('.temp/templates'));
});

// 把html转为js缓存模板
gulp.task('html', ['templates'], function () {
    return gulp.src('.temp/templates/**/*.js')
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./client/templates/'));
});

//  把css js引入到页面 (app&&bower)
gulp.task('inject', function () {
    var target = gulp.src('./client/index.html');
    target
        .pipe(wiredep())
        .pipe(inject(gulp.src([
            './client/**/*.js',
            './client/**/*.css',
            '!./client/bower_components/**/*.css',
            '!./client/bower_components/**/*.js'
        ], {read: false}), {
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
});


//  把html引用的css和js压缩到目标文件压缩并引用 放到dist
gulp.task('usemin', ['default', 'static'], function () {
    return gulp.src('./client/index.html')
        .pipe($.usemin({
            cssVendor: [$.minifyCss(), $.rev()],
            cssApp: [$.minifyCss(), $.rev()],
            jsVendor: [$.uglify(), $.rev()],
            jsApp: [$.uglify(), $.rev()]
        }))
        .pipe(gulp.dest('dist/client'));
});

// 将最后上线需要的文件输出到dist文件夹
gulp.task('dist', ['usemin'], function () {
    gulp.src('./server/**/*')
        .pipe(gulp.dest('./dist/server'));
});

// 监听任务
gulp.task('watch', function () {
    browserSync.init({
        proxy: 'localhost:3000',
        files: ['./**/*.{js,css,html}']
    });

    var cssWatcher = gulp.watch([
        '!./client/bower_components/**/*.css',
        './client/**/*.scss'
    ], ['styles', 'inject']);

    var jsWatcher = gulp.watch([
        '!./client/bower_components/**/*.js',
        './client/**/*.js'
    ], ['inject']);

    var htmlWatcher = gulp.watch([
        '!./client/bower_components/**/*.html',
        './client/**/*.html'
    ], ['html', 'inject']);

});

gulp.task('default', ['styles', 'html'], function () {
    gulp.run('inject');
});