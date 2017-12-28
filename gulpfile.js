var // módulos:
  gulp = require("gulp"),
  newer = require("gulp-newer"),
  imagemin = require("gulp-imagemin"),
  htmlclean = require("gulp-htmlclean"),
  plumber = require("gulp-plumber"),
  concat = require("gulp-concat"),
  deporder = require("gulp-deporder"),
  stripdebug = require("gulp-strip-debug"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  assets = require("postcss-assets"),
  autoprefixer = require("autoprefixer"),
  mqpacker = require("css-mqpacker"),
  cssnano = require("cssnano");

// modo de desenvolvimento?
devBuild = process.env.NODE_ENV !== "production";

// folders
folder = {
  src: "src/",
  build: "build/"
};

// processamento das imagens
gulp.task("images", function() {
  var out = folder.build + "images/";
  return gulp
    .src(folder.src + "images/**/*")
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

// processamento HTML
gulp.task("html", ["images"], function() {
  var out = folder.build + "html/",
    page = gulp.src(folder.src + "html/**/*").pipe(newer(out));

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean());
  }

  return page.pipe(gulp.dest(out));
});

// processamento dos arquivos JavaScript
gulp.task("js", function() {
  var jsbuild = gulp
    .src(folder.src + "js/**/*")
    .pipe(plumber())
    .pipe(deporder())
    .pipe(concat("all.js"));
  if (!devBuild) {
    jsbuild = jsbuild.pipe(stripdebug()).pipe(uglify());
  }
  return jsbuild.pipe(gulp.dest(folder.build + "js/"));
});

// processamento do CSS
gulp.task("css", ["images"], function() {
  var postCssOpts = [
    assets({ loadPaths: ["images/"] }),
    autoprefixer({ browsers: ["last 2 versions", "> 2%"] }),
    mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp
    .src(folder.src + "scss/main.scss")
    .pipe(
      sass({
        outputStyle: "nested",
        imagePath: "images/",
        precision: 3,
        errLogToConsole: true
      })
    )
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build + "css/"));
});

// Execução de todas as tarefas criadas acima
gulp.task("run", ["html", "css", "js"]);

// Monitoramento de modificações
gulp.task("watch", function() {
  // Modificações em imagens
  gulp.watch(folder.src + "images/**/*", ["images"]);

  // Modificações em arquivos html
  gulp.watch(folder.src + "html/**/*", ["html"]);

  // Modificações em arquivos javascript
  gulp.watch(folder.src + "js/**/*", ["js"]);

  // Modificações em arquivos css
  gulp.watch(folder.src + "scss/**/*", ["css"]);
});

// Tarefa default
gulp.task("default", ["run", "watch"]);
