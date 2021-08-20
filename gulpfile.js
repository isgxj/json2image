const gulp = require('gulp');
const rollup = require('rollup');
const browserSync = require('browser-sync').create(); //浏览器刷新
const { getBabelOutputPlugin } = require('@rollup/plugin-babel');
const { terser } =  require("rollup-plugin-terser");

const jsDir = 'src/*.js';
const htmlDir = 'src/dev/index.html';

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

  const file = 'src/dev/index.js';
  await bundle.write({
    file,
    format: 'umd',
    name: 'json2image',
    sourcemap: true,
  });
  browserSync.reload(file);
  cb && cb();
};

const buildHtml = function (cb) {
  gulp.src(htmlDir).pipe(browserSync.stream());
  cb();
};

const dev = function () {
  browserSync.init({
    server: 'src/dev/',
    port: 8080,
    open: 'external',
  });
  gulp.watch([jsDir], buildJs);
  gulp.watch([htmlDir], buildHtml);
};

const build = function (cb) {
  buildJs();
  gulp.src('src/dev/*').pipe(gulp.dest('doc'));
  cb();
}

exports.default = dev;
exports.build = build;
