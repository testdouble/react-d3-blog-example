// Rollup plugins.
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/index.js',
  dest: 'dist/pie.js',
  format: 'iife',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ 'es2015-rollup', 'stage-0', 'react' ],
      plugins: [ 'lodash' ]
    }),
    cjs({
      exclude: [
        'node_modules/process-es6/**'
      ],
      include: [
        'node_modules/fbjs/**',
        'node_modules/object-assign/**',
        'node_modules/react/**',
        'node_modules/react-dom/**',
        'node_modules/lodash/**',
      ]
    }),
    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({
      browser: true,
      main: true
    })
  ]
}
