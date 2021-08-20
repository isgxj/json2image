import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    name: 'json2image',
    format: 'umd',
  },
  plugins: [
    getBabelOutputPlugin({
      allowAllFormats: true,
      presets: [['@babel/preset-env', {
        modules: 'umd',
      }]],
    }),
    terser(),
  ],
};
