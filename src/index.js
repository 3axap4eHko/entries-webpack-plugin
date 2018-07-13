const PLUGIN_NAME = 'entries-webpack-plugin';

module.exports = class EntriesWebpackPlugin {
  constructor(options) {
    this.filename = options && options.filename || 'entries.json';
    this.pretty = options && options.pretty;
  }

  apply(compiler) {
    const entries = {};

    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      const { entrypoints } = compilation.getStats().toJson();

      Object.entries(entrypoints).forEach(([entry, { assets }]) => {
        entries[entry] = {
          js: assets.filter(filename => /\.js$/.test(filename)),
          css: assets.filter(filename => /\.css$/.test(filename)),
        };
      });

      const json = JSON.stringify(entries, null, this.pretty ? '  ' : null);

      compilation.assets[this.filename] = {
        source: () => json,
        size: () => json.length,
      };
    });
  }
};

