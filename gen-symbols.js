var fs = require('fs');
var path = require('path');

var async = require('async');
var SVGO = require('svgo');
var cheerio = require('cheerio');

function findFiles(callback) {
  fs.readdir('svg', function (err, files) {
    if (err) {
      callback(err);
    } else {
      callback(null, files.filter(function (filename) {
        return /\.svg$/.test(filename);
      }).map(function (filename) {
        return path.resolve('svg', filename);
      }));
    }
  });
}

function readFile(filename, callback) {
  fs.readFile(filename, 'utf-8', function (err, content) {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        filename: filename,
        content: content
      });
    }
  });
}

function readFiles(files, callback) {
  async.mapLimit(files, 10, readFile, callback);
}

function optimizeFile(data, callback) {
  var svgo = new SVGO();
  svgo.optimize(data.content, function (result) {
    setImmediate(function() {
      callback(null, {
        filename: data.filename,
        content: result.data
      });
    });
  });
}

function optimizeFiles(files, callback) {
  async.mapSeries(files, optimizeFile, callback);
}

function createSymbols(files, callback) {
  var doc = cheerio('<svg xmlns="http://www.w3.org/2000/svg"/>');
  var names = [];
  files.forEach(function (file) {
    var name = path.basename(file.filename, '.svg');
    var svg = cheerio(file.content);
    var symbol = cheerio('<symbol/>');
    symbol.attr('viewBox', svg.attr('viewbox'));
    symbol.attr('id', name);
    symbol.append(svg.children());
    doc.append(symbol);
    names.push(name);
  });
  callback(null, {
    svg: doc.toString(),
    names: names
  });
}

function writeSymbolsFile(data, callback) {
  async.parallel([
    function (callback) {
      fs.writeFile('symbols.svg', data.svg, callback);
    },
    function (callback) {
      var html = '';
      data.names.forEach(function (name) {
        html += '<svg style="width: 30px; height: 30px;"><use xlink:href="symbols.svg#' + name + '"></svg>';
      });
      fs.writeFile('symbols.html', html, callback);
    }
  ], callback);
}

async.waterfall([
  findFiles,
  readFiles,
  optimizeFiles,
  createSymbols,
  writeSymbolsFile
], function (err) {
  if (err) {
    console.error('fail: ', err);
  }
});
