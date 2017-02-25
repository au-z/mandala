var gulp = require('gulp');
var	concat = require('gulp-concat');
var	uglify = require('gulp-uglify');
var	rename = require('gulp-rename');
var	pump = require('pump');

gulp.task('js', function(cb) {
	pump([
		gulp.src('./js/**/*.js'),
			concat('./dist/mandala.js'),
			gulp.dest('.'),
			rename({extname: '.min.js'}),
			// uglify(),
			gulp.dest('.'),
	], cb);
});

gulp.task('js:w', function() {
	gulp.watch('./js/**/*.js', ['js']);
});
