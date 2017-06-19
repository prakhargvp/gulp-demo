// https://css-tricks.com/gulp-for-beginners/
//
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
// Minify CSS
var cssnano = require('gulp-cssnano');
// Minify images
var imagemin = require('gulp-imagemin');
// Caching
var cache = require('gulp-cache');
// Cleaning
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass',function(){
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass()) // convert Sass to CSS with gulp-sass
	.pipe(gulp.dest('app/css'))	
	.pipe(browserSync.reload({
		stream: true
	}))
});

// Gulp Watch Syntax
// gulp.watch('files-to-watch', ['Tasks', 'to', 'run'])
gulp.task('watch',['browserSync', 'sass'],function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	// Other watchers
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/*.js', browserSync.reload);
});

// browser-sync
gulp.task('browserSync',function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	});
});

// useref
gulp.task('useref',function(){
	return gulp.src('app/*.html')
	.pipe(useref())
	// minifies only if it's a Javascript File
	.pipe(gulpIf('*.js', uglify()))
	// minifies only if it's a CSS File
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});


// Images
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

// Copying Fonts to Dist
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});


// Cleaning
gulp.task('clean:dist', function(){
	return del.sync('dist');
});


// Clear Local-cache
gulp.task('cache:clear', function (callback) {
	return cache.clearAll(callback)
})

gulp.task('build', function(callback) {
 	runSequence('clean:dist', 
	['sass', 'useref', 'images', 'fonts'], 
	callback
	)
});

gulp.task('default', function(callback){
	runSequence(['sass', 'browserSync', 'watch'],
		callback
	)
});
