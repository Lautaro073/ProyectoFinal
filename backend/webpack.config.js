const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    express: 'commonjs express',
    // Añade aquí cualquier otra dependencia que no quieras incluir en el paquete
  },
};
