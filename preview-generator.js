#!/usr/bin/env node

/*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
    https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
*/

// dependencies
var fs = require('fs');

fs.readdir('./assets', function (err, files) {
  var page = fs.readFileSync('./preview-template.html').toString().replace(
    '{{emoji-list}}',
    '<li>' + files.map(function (file) {
      return file.replace('.ai', '').split('-').map(function (hex) {
        return '&#x' + hex.toUpperCase() + ';';
      }).join('');
    }).join('</li>\n      <li>')+ '</li>'
  );
  fs.writeFileSync(
    './preview.html',
    page.replace(
      '{{emoji-options}}',
      JSON.stringify({
        size: 72
      })
    )
  );
  fs.writeFileSync(
    './preview-svg.html',
    page.replace(
      '{{emoji-options}}',
      JSON.stringify({
        folder: 'svg',
        ext: '.svg',
        base: ''
      })
    )
  );
});