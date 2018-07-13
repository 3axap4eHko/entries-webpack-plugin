import webpack from 'webpack';
import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import DumpPlugin from '../index';

const compiler = webpack({
  entry: {
    index: `${__dirname}/../__fixtures__/entry.js`,
  },
  output: {
    path: resolve(process.cwd(), '.tmp'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
    ],
  },
  plugins: [
    new DumpPlugin({
      filename: 'dump.json',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].css',
    }),
  ],

});

it('test', done => {
  compiler.run((error, stats) => {
    expect(error).toEqual(null);
    expect(stats.compilation.errors).toHaveLength(0);
    
    done();
  });
});

