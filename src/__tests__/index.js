import webpack from 'webpack';
import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import EntriesPlugin from '../index';

const compiler = webpack({
  entry: {
    index: `${__dirname}/../__fixtures__/index.js`,
    about: `${__dirname}/../__fixtures__/about.js`,
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/](node_modules|vendor)[\\/]/,
          priority: -10,
        },
        default: {
          //minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new EntriesPlugin({
      filename: 'entries.json',
      pretty: true,
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

