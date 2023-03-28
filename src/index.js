import { writeFile } from 'fs';
import { resolve } from 'path';

const PLUGIN_NAME = 'entries-webpack-plugin';

function iterate(middlewares, compilation, entries, cb) {
  if (middlewares.length) {
    const middleware = middlewares.shift();
    const promise = new Promise(resolve => middleware(compilation, entries, resolve));
    promise.then(result => iterate(middlewares, compilation, result, cb));
  } else {
    cb(entries);
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
        entries[entry] = assets.reduce((accumulator, { name }) => {
          if (/\.js$/.test(name)) {
            accumulator.js.push(name);
          } else if (/\.css$/.test(name)) {
            accumulator.css.push(name);
          }
          return accumulator;
        }, { js: [], css: [] });
      });

      iterate([...this.middlewares], compilation, entries, (result) => {
        const filename = resolve(outputPath, this.filename);
        const json = JSON.stringify(result, null, this.pretty ? '  ' : null);
        writeFile(filename, json, cb);
      });
    });
  }
};

