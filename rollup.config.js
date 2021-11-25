/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-25 12:04:04
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-25 20:09:40
 */

import dtsPlugin from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';
import commonJSPlugin from '@rollup/plugin-commonjs';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import integrateDtsPlugin from './scripts/integrateDtsPlugin';

function createComplieConfig({ dts, esm } = {}) {

  let file = 'lib/moineau.js';

  if (dts) {
    file = file.replace(/\.js$/ig, '.d.ts');
  }

  if (esm) {
    file = file.replace(/\.js$/ig, '.mjs');
  }

  /** @type {import('rollup').RollupOptions} */
  return {
    input: 'src/application.ts',
    output: {
      format: dts || esm ? 'esm' : 'cjs',
      file,
      exports: 'named'
    },
    external: ['puppeteer', 'moment'],
    plugins: [
      nodeResolvePlugin({
        mainFields: dts ? ['types', 'typings'] : ['module', 'main'],
        extensions: dts ? ['.d.ts', '.ts'] : ['.js', '.json', '.mjs'],
        moduleDirectories: dts
          ? ['node_modules/@types', 'node_modules']
          : ['node_modules'],
      }),

      !dts && commonJSPlugin(),

      !dts && esbuildPlugin({
        target: 'es2017'
      }),

      dts && dtsPlugin(),
      dts && integrateDtsPlugin('src/@types/types.d.ts', 'lib/moineau.d.ts')

    ].filter(Boolean)
  }

}

export default [
  createComplieConfig(),
  createComplieConfig({ esm: true }),
  createComplieConfig({ dts: true })
]