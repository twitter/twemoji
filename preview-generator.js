#!/usr/bin/env node

/*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
    https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
*/

// dependencies
var fs = require('fs');

fs.readdir('./36x36', function (err, files) {
  fs.writeFileSync(
    './preview.html',
    fs.readFileSync('./preview-template.html').toString().replace(
      '{{emoji-list}}',
      '<li>' + files.map(function (file) {
        return file.replace('.png', '').split('-').map(function (hex) {
          return '&#x' + hex.toUpperCase() + ';';
        }).join('');
      }).join('</li>\n      <li>')+ '</li>'
    )
  );
});