#!/usr/bin/env node

/*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
    https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
*/

var fs = require('fs');

fs.writeFileSync(
  'twemoji.npm.js',
  [
    'var location = global.location || {};',
    fs.readFileSync('twemoji.js'),
    'if (!location.protocol) {',
    '  twemoji.base = twemoji.base.replace(/^http:/, "");',
    '}',
    'module.exports = twemoji;'
  ].join('\n')
);

fs.writeFileSync(
  'twemoji.amd.js',
  'define(function () {\n' +
    fs.readFileSync('twemoji.js').toString().replace(
      /^(.)/gm, '  $1'
    ) +
  '\n  return twemoji;\n});'
);

require('child_process').spawn(
  'node',
  [
    'node_modules/uglify-js/bin/uglifyjs',
    '--verbose',
    'twemoji.js',
    '-o',
    'twemoji.tmp.js'
  ]
).on('close', function () {
  fs.writeFileSync(
    'twemoji.min.js',
    '/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */\n' +
    fs.readFileSync('twemoji.tmp.js')
  );
  fs.unlink('twemoji.tmp.js');
  // gzip -c twemoji.min.js | wc -c
});