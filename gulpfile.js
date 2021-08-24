const gulp = require('gulp');
const rollup = require('rollup');
const browserSync = require('browser-sync').create(); //浏览器刷新
const { getBabelOutputPlugin } = require('@rollup/plugin-babel');
const { terser } =  require("rollup-plugin-terser");

const devDir = 'src/dev/';
const jsDir = 'src/*.js';
const htmlDir = `${devDir}index.html`;
const dataDir = `${devDir}data.js`;
const outputDir = 'doc/';

const buildJs = async function (cb) {
  const bundle = await rollup.rollup({
    input: './src/index.js',
    plugins: [
      getBabelOutputPlugin({
        allowAllFormats: true,
        presets: [['@babel/preset-env', {
          modules: 'umd',
        }]],
      }),
      terser(),
    ],
  });

  const file = `${outputDir}index.js`;
  await bundle.write({
    file,
    format: 'umd',
    name: 'json2image',
    sourcemap: true,
  });
  browserSync.reload(file);
  cb && cb();
};

const buildHtml = function () {
  return gulp.src(htmlDir)
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.stream());
};

const buildData = function () {
  return gulp.src(dataDir)
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.stream());
};

const build = function () {
  buildJs();
  return gulp.src(`${devDir}**/*`).pipe(gulp.dest(outputDir));
}

const dev = function () {
  build();
  browserSync.init({
    server: outputDir,
    port: 8080,
    open: 'external',
  });
  gulp.watch([jsDir], buildJs);
  gulp.watch([htmlDir], buildHtml);
  gulp.watch([dataDir], buildData);
};

exports.default = dev;
exports.build = build;
