import { readFileSync } from 'fs';
import webpack from 'webpack';
import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import EntriesPlugin from '../index';

function injectionMidleware(compilation, entrypoints, cb) {
  cb({ ...entrypoints, test: 1 });
}

const compiler = webpack({
  mode: 'development',
  entry: {
    index: `${__dirname}/../__fixtures__/index.js`,
    about: `${__dirname}/../__fixtures__/about.js`,
  },
  output: {
    path: resolve(process.cwd(), '.tmp'),
    filename: 'js/[name].[hash].js',
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
      middlewares: [
        injectionMidleware,
      ],
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

    const { outputPath } = stats.toJson();
    const entries = JSON.parse(readFileSync(`${outputPath}/entries.json`, 'utf8'));

    expect(entries).toHaveProperty('index');
    expect(entries.index).toHaveProperty('js');
    expect(entries.index).toHaveProperty('css');
    expect(entries).toHaveProperty('about');
    expect(entries.about).toHaveProperty('js');
    expect(entries.about).toHaveProperty('css');
    expect(entries).toHaveProperty('test');

    done();
  });
});

