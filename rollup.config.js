import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

// Require understands JSON files.
const packageJson = require('./package.json');

const dependencies = Object.keys(packageJson.dependencies);
const peerDependencies = Object.keys(packageJson.peerDependencies);
const globals = {
    '@fortawesome/react-fontawesome': 'reactFontawesome',
    'prop-types': 'PropTypes',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'reactstrap': 'reactstrap',
};

function baseConfig() {
  return {
    input: 'src/index.js',
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        babelrc: false,
        runtimeHelpers: true,
        exclude: 'node_modules/**',
        presets: [
          ['env', { modules: false }],
          'react',
          'stage-3'
        ],
        plugins: [
          'external-helpers',
          'transform-runtime',
          'transform-object-rest-spread'
        ],
      }),
    ]
  };
}

/* COMMONJS / MODULE CONFIG */
const libConfig = baseConfig();
libConfig.external = peerDependencies.concat(dependencies);
libConfig.output = [
  {
    file: 'dist/lemo-form.cjs.js',
    format: 'cjs',
    globals: globals,
    name: packageJson.name,
    sourcemap: true,
  },
  {
    file: 'dist/lemo-form.es.js',
    format: 'es',
    globals: globals,
    name: packageJson.name,
    sourcemap: true,
  },
];

/* UMD CONFIG */
const umdConfig = baseConfig();
umdConfig.external = peerDependencies;
umdConfig.output = [
  {
    file: 'dist/lemo-form.js',
    format: 'umd',
    globals: globals,
    name: packageJson.name,
    sourcemap: true,
  },
];

/* UMD CONFIG - Min */
const umdConfigMin = baseConfig();
umdConfigMin.external = peerDependencies;
umdConfigMin.output = [
  {
    file: 'dist/lemo-form.min.js',
    format: 'umd',
    globals: globals,
    name: packageJson.name,
    sourcemap: true,
  },
];
umdConfigMin.plugins.push(minify({ comments: false }));

export default [
  libConfig,
  umdConfig,
  umdConfigMin,
];