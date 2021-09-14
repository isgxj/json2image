import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    name: 'json2image',
    format: 'umd',
  },
  plugins: [
    typescript(),
    getBabelOutputPlugin({
      allowAllFormats: true,
      presets: [['@babel/preset-env', {
        modules: 'umd',
      }]],
    }),
    terser(),
  ],
};
