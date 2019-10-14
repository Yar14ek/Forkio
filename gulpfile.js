const gulp = require('gulp'),//основной плагин gulp
    scss = require('gulp-sass'),//препроцессор
    uglify = require('gulp-uglify-es').default, //минификация js
    prefixer = require('gulp-autoprefixer'), //расставление автопрефиксов
    cssmin = require('gulp-minify-css'), //минификация css
    jshint = require("gulp-jshint"), //отслеживание ошибкок в js
    sourcemaps = require('gulp-sourcemaps'), //sourcemaps
    imagemin = require('gulp-imagemin'), //минимизация изображений
    imageminSvgo = require('imagemin-svgo'),// оптимизация img.svg
    rimraf = require('rimraf'), //очистка dist
    rename = require("gulp-rename"), //переименвоание файлов
    plumber = require("gulp-plumber"), //предохранитель для остановки гальпа
    connect = require('gulp-connect'),//livereload
    browserSync = require('browser-sync').create(),
    rigger = require('gulp-rigger'),//работа с инклюдами в html и js
    gulpSequence = require('gulp-sequence'),
    gutil = require('gulp-util');


let path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        fonts: 'dist/fonts/',
        htaccess: 'dist/',
        img: 'dist/img/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/template/*.html',
        js: 'src/js/**/*.js',
        scss: 'src/scss/*.scss',
        cssVendor: 'src/css/vendor/*.*',
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.*',
        htaccess: 'src/.htaccess'
    },
    watch: {
        html: './index.html',
        js: 'src/js/**/**.js',
        scss: 'src/scss/**/**.*',
        img: 'src/img/**/**.*',
        fonts: 'src/fonts/**/**.*',
        htaccess: 'src/.htaccess',
    },
    clean: './dist', //директории которые могут очищаться
    baseDir: './' //исходная корневая директория для запуска минисервера
};
// Локальный сервер для разработки
gulp.task('connect', function () {
    browserSync.init({
        server: path.baseDir
    });
    gulp.watch('./src/scss/**/*.scss', ["sass"]).on("change", browserSync.reload);
    gulp.watch(path.src.img, ["img"]).on("change", browserSync.reload);
    gulp.watch('./src/js/**/*.js', ["js"]).on("change", browserSync.reload);
    // gulp.watch("./index.html").on("change", browserSync.reload);

});
// таск для билдинга html
/*gulp.task('html', function () {
 gulp.src(path.src.html) //Выберем файлы по нужному пути
 .pipe(rigger()) //Прогоним через rigger
 .pipe(gulp.dest(path.build.html)) //выгрузим их в папку build
 .pipe(connect.reload()) //И перезагрузим наш сервер для обновлений
 });*/

// проверка js на ошибки и вывод их в консоль
gulp.task('jshint', function () {
    return gulp.src(path.src.js) //выберем файлы по нужному пути
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish')); //стилизуем вывод ошибок в консоль
});


gulp.task('js', function () {
    gulp.src('./src/js/main.js') //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к выходному файлу
        .pipe(gulp.dest(path.dist.js)); //выгрузим готовый файл в build
});

gulp.task('img', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true, //сжатие .jpg
            svgoPlugins: [{removeViewBox: false}], //сжатие .svg
            interlaced: true, //сжатие .gif
            optimizationLevel: 3 //степень сжатия от 0 до 7
        }))
        .pipe(gulp.dest(path.dist.img)); //выгрузим в build
});

gulp.task('sass', function () {
    return gulp.src(path.src.scss)
        .pipe(sourcemaps.init())
        .pipe(scss().on("error", scss.logError))
        .pipe(prefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к имени выходного файла
        .pipe(gulp.dest(path.dist.css));

});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});



// билдим всё
gulp.task('dev', gulpSequence('clean','connect', ['sass', 'img', 'js'], 'jshint'));

gulp.task('build', gulpSequence('clean', ['sass', 'img', 'js'], 'jshint'));

