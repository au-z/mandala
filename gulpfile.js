var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	pump = require('pump');

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

gulp.task('js', function(cb){
	pump([
		gulp.src('./js/**/*.js'),
			concat('./dist/pythagoras.js'),
			gulp.dest('.'),
			rename({ extname: '.min.js' }),
			uglify(),
			gulp.dest('.'),
	], cb);
});

gulp.task('js:w', function(){
	gulp.watch('./js/**/*.js', ['js']);
});