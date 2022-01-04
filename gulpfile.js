let gulp = require("gulp");
let sass = require("gulp-sass")(require("sass"));
let prefix = require("gulp-autoprefixer");
let sourcemaps = require("gulp-sourcemaps");

// Development

function cssCompilerDev() {
  return gulp
    .src("./src/assets/sass/**/*.sass")
    .pipe(sourcemaps.init()) // init sourcemaps (-dev)
    .pipe(sass().on("error", sass.logError))
    .pipe(prefix("last 2 versions")) // add browser prefixes
    .pipe(sourcemaps.write()) // write sourcemaps (-dev)
    .pipe(gulp.dest("./src/assets/css")); // output directory
}

// Production

function cssCompiler() {
  return gulp
    .src("./src/assets/sass/**/*.sass")
    .pipe(
      sass({
        outputStyle: "compressed", // minify
      })
    ) // compile sass
    .pipe(prefix("last 2 versions")) // add browser prefixes
    .pipe(gulp.dest("./src/assets/css")); // output directory
}

// Tasks

gulp.task("cssDev", cssCompilerDev);
gulp.task("css", cssCompiler);

// Watch

gulp.task("production", function () {
  gulp.watch("./src/assets/sass/**", gulp.series("css"));
});

gulp.task("dev", function () {
  gulp.watch("./src/assets/sass/**", gulp.series("cssDev"));
});
