const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');


// Static server
gulp.task('server', function () {   // Запускаем локальный сервер
  browserSync.init({
    server: {
      baseDir: "src"  // Папка, которую будет подхватывать gulp
    }
  });
});

gulp.task('styles', function () {
  return gulp.src("src/sass/**/*.+(scss|sass)")  // берём любой файл с расширением cscc или sasss
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))  // А тут мы его уже компилируем+сжимает и в случае ошибки, подскажет, где она
    .pipe(rename({   // Используем плагин rename
      suffix: ".min",
      prefix: ""
    }))
    .pipe(autoprefixer())  // Используем плагин autoprefixer
    .pipe(cleanCSS({compatibility: 'ie8'}))   // Используем плагин cleanCSS
    .pipe(gulp.dest('src/css'))  // После этого мы кладём файл по пути src/css
    .pipe(browserSync.stream());  // После изменений, обновляем страницу командой
});

gulp.task('watch', function () {
  gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles')) // Отслеживаем изменения в этом файле, после чего, запускаем таск 'styles'
  gulp.watch("src/*.html", gulp.parallel('styles')) // Отслеживаем изменения в этом файле, после чего, обновляем страницу
})

gulp.task('default', gulp.parallel('watch', 'server', 'styles')); // Выполняется при команде gulp