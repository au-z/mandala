var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin');

gulp.task('sass', function(){
	return gulp.src('./sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('./dist/pythagoras.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('.'));
});

gulp.task('sass:w', function(){
	gulp.watch('./sass/**/*.scss', ['sass'])
});

gulp.task('js', function(){
  //TODO
  return gulp.src('./js/**/*.js');
})