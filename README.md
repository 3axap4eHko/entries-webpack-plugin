# Entries Webpack Plugin

Outputs webpack assets chunks for entries to a json file

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Problem

Webpack 4 optimization splits code of entry to chunks.
So in the result you can have a few chunks for the entry and some of the entries can share some chunks.

## Solution

To get all chunks for a entry you can use `entries-webpack-plugin`

webpack config
```js
{
  // ...
  entry: {
    index: 'index.js',
    about: 'about.js',
  },
  optimization: {
    // ...
  }
  // ...
  plugins: [
    new EntriesPlugin({
      filename: 'entries.json',
      pretty: true,
    }),
  ]
}
```
where index and about share common js and css libs
as the result of optimization you will have `vendors~index~about~post` common `js` and `css` chunks
so output is
```json
{
  "index": {
    "js": [
      "vendors~index~about.c025d01e7caee3789803.js",
      "index.c025d01e7caee3789803.js"
    ],
    "css": [
      "vendors~index~about.c025d01e7caee3789803.css"
    ]
  },
  "about": {
    "js": [
      "vendors~index~about.c025d01e7caee3789803.js",
      "about.c025d01e7caee3789803.js"
    ],
    "css": [
      "vendors~index~about.c025d01e7caee3789803.css"
    ]
  }
}
```
## License
License [The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2018 Ivan Zakharchanka

[downloads-image]: https://img.shields.io/npm/dm/entries-webpack-plugin.svg?longCache=true&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/entries-webpack-plugin
[npm-image]: https://img.shields.io/npm/v/entries-webpack-plugin.svg?longCache=true&style=for-the-badge

[travis-url]: https://travis-ci.org/3axap4eHko/entries-webpack-plugin
[travis-image]: https://img.shields.io/travis/3axap4eHko/entries-webpack-plugin/master.svg?longCache=true&style=for-the-badge