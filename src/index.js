import { writeFile } from 'fs';
import { resolve } from 'path';

const PLUGIN_NAME = 'entries-webpack-plugin';

function iterate(middlewares, entrypoints, cb) {
  if (middlewares.length) {
    const middleware = middlewares.shift();
    const promise = new Promise(resolve => middleware(entrypoints, resolve));
    promise.then(result => iterate(middlewares, result, cb));
  } else {
    cb(entrypoints);
  }
}

module.exports = class EntriesWebpackPlugin {
  constructor(options) {
    this.filename = options && options.filename || 'entries.json';
    this.middlewares = options && options.middlewares || [];
    this.pretty = options && options.pretty;
  }

  apply(compiler) {
    const entries = {};

    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, (compilation, cb) => {
      const { outputPath, entrypoints } = compilation.getStats().toJson();

      Object.entries(entrypoints).forEach(([entry, { assets }]) => {
        entries[entry] = {
          js: assets.filter(filename => /\.js$/.test(filename)),
          css: assets.filter(filename => /\.css$/.test(filename)),
        };
      });

      iterate([...this.middlewares], entries, (result) => {
        const filename = resolve(outputPath, this.filename);
        const json = JSON.stringify(result, null, this.pretty ? '  ' : null);
        writeFile(filename, json, cb);
      });
    });
  }
};

