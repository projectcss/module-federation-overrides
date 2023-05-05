import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import jsx from 'acorn-jsx';
import typescript from '@rollup/plugin-typescript';

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "iife",
    sourcemap: true,
  },
  acornInjectPlugins: [jsx()],
  plugins: [
    resolve(),
    typescript({ jsx: 'preserve' }),
    babel({
        exclude: "**/node_modules/**",
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
    }),
    commonjs(),
    postcss({
      // This plugin will process files ending with these extensions and the extensions supported by custom loaders.
      extensions: [".less", ".css"],
    }),
  ]
};