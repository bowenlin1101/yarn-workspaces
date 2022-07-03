// const path = require('path');
import path from 'path';
import fs from 'fs'

export default {
  entry: 
  {index:'./src/index.ts',
    server: './src/server.ts'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader', ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  externals: [{sqlite3: 'commonjs sqlite3'}],
};