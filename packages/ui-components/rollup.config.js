import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import image from "rollup-plugin-image"
import babel from "rollup-plugin-babel"
import jsx from "rollup-plugin-jsx"
import flow from "rollup-plugin-flow"

export default {
  input: "./index.js",
  plugins: [
    resolve({ extensions: [".js", ".jsx"], jsnext: true, main: true }),
    commonjs({
      esnext: true,
      main: true
    }),
    image(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    }),
    jsx({
      factory: "React.createElement"
    }),
    flow()
  ],
  external: ["react", "jest"],
  output: {
    format: "es",
    file: "./dist/components.js" // equivalent to --output
  }
}