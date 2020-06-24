const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-dart-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");

function moveToDocs() {
	return src([
		'dist/*.css',
		'dist/*.min.css'
	])
	.pipe(dest('docs/css'))
}

function compileFramework() {
	return src('src/pixelgrids.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('dist/'));
}

function minifyFramework() {
	return src('dist/pixelgrids.css')
		.pipe(cleanCSS({debug: true}, (details) => {
	      console.log(`${details.name}: ${details.stats.originalSize}`);
	      console.log(`${details.name}: ${details.stats.minifiedSize}`);
	    }))
	    .pipe(rename({ extname: '.min.css' }))
		.pipe(dest('dist/'));
}

function compileDocsStyles() {
	return src('docs/scss/styles.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('docs/css/'));
}

function minifyDocsStyles() {
	return src('docs/css/styles.css')
		.pipe(cleanCSS({debug: true}, (details) => {
	      console.log(`${details.name}: ${details.stats.originalSize}`);
	      console.log(`${details.name}: ${details.stats.minifiedSize}`);
	    }))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(dest('docs/css/'));
}

exports.default = function() {
  watch('docs/scss/styles.scss', series(
  	compileDocsStyles,
  	minifyDocsStyles
  ));
  watch('src/pixelgrids.scss', series(
  	compileFramework, 
  	minifyFramework,
  	moveToDocs
  ));
};