var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

/* Bundle Client Scripts */
gulp.task('scripts', function() {
  return gulp.src('public/js/*.js')
    .pipe(browserify())
    // .pipe(uglify())
    .pipe(rename({suffix: '-bundle'}))
    .pipe(gulp.dest('public/build/js'));
});

gulp.task('default', function () {
  gulp.start('scripts');
});
