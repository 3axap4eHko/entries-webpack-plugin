import { writeFile } from 'fs';
import { resolve } from 'path';

const PLUGIN_NAME = 'bundle-webpack-plugin';

export default class DumpWebpackPlugin {
  constructor(options) {
    this.filename = options && options.filename || 'entries.json';
    this.pretty = options && options.pretty;
  }

  apply(compiler) {
    const entries = {};

    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, (compilation, cb) => {
      const { outputPath, entrypoints } = compilation.getStats().toJson();

      const dumpFilename = resolve(outputPath, this.filename);
      Object.entries(entrypoints).forEach(([entry, { assets }]) => {
        entries[entry] = {
          js: assets.filter(filename => /\.js$/.test(filename)),
          css: assets.filter(filename => /\.css$/.test(filename)),
        };
      });

      writeFile(dumpFilename, JSON.stringify(entries, null, this.pretty ? '  ' : null), cb);
    });
  }
}

