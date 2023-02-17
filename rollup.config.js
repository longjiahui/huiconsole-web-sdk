import terser from "@rollup/plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import gzip from "rollup-plugin-gzip"
import del from "rollup-plugin-delete"

// nanoid commonjs to esm
import commonjs from "@rollup/plugin-commonjs"
// node polyfills resolve some lib used in nanoid
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default { 
    input: 'src/index.js',
    output: [{
        file: 'dist/huiconsole.cjs',
        format: 'cjs',
    }, {
        file: 'dist/huiconsole.js',
        format: 'es',
    }, {
        file: 'dist/huiconsole.min.js',
        format: 'iife',
        name: 'huiconsole',
        plugins: [terser()]
    }],
    plugins: [del({ targets: 'dist'}), resolve({browser: true}), commonjs(), nodePolyfills(), babel({ babelHelpers: 'bundled' }), gzip({
        filter: /.*\.min\.js$/
    })]
}