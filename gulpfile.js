var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel');

gulp.task('sass', function(){
	return gulp.src('./sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('./dist/pythagoras.css'))
		.pipe(gulp.dest('.'))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(cssmin())
		.pipe(gulp.dest('.'));
});

gulp.task('sass:w', function(){
	gulp.watch('./sass/**/*.scss', ['sass'])
});

gulp.task('js', function(){
  return gulp.src('./js/**/*.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(concat('./dist/pythagoras.js'))
		.pipe(gulp.dest('.'))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(uglify())
		.pipe(gulp.dest('.'));
});

gulp.task('js:w', function(){
	gulp.watch('./js/**/*.js', ['js']);
});