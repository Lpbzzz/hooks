import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import deletePlugin from 'rollup-plugin-delete';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'auto',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', sourceMap: false, inlineSourceMap: false, inlineSources: false }),
    deletePlugin({
      targets: 'dist/*',  // 删除 dist 目录下的所有文件
      hook: 'buildStart'  // 在构建开始时清空文件
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
      ecma: 2015,
      keep_classnames: false,
      keep_fnames: false,
      module: false,
      toplevel: false,
      safari10: false,
    }),
  ],
  external: ['react', 'react-dom'],
};
