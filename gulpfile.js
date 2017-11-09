var 
  // módulos:
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify')

// modo de desenvolvimento?
devBuild = true

// folders
folder = {
  src: 'src/',
  build: 'build/'
}

// processamento das imagens
gulp.task('images', function() {
  var out = folder.build + 'images/';
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

// processamento dos arquivos JavaScript
gulp.task('js', function() {
    var jsbuild = gulp.src(folder.src + 'js/**/*')
      .pipe(plumber())
      .pipe(deporder())
      .pipe(concat('all.js')); 
    if (!devBuild) {
      jsbuild = jsbuild
        .pipe(stripdebug())
        .pipe(uglify());
    }
    return jsbuild.pipe(gulp.dest(folder.build + 'js/'));
  });