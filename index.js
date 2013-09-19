"use strict";

var path = require('path'),
    fs = require('fs'),
    css = require('css'),
    q = require('kew')

function readFile() {
  var promise = q.defer()
  Array.prototype.push.call(arguments, promise.makeNodeResolver())
  fs.readFile.apply(null, arguments)
  return promise
}

var woffURL = /(url\(([^\)]*\.woff[^(url|format)\(]*)\))/

module.exports = function(mod, graph) {
  if (!/.*\.(css|styl|sass|scss|less)$/.exec(mod.id)) return

  var ast = css.parse(mod.source.toString())

  var rewrites = ast.stylesheet.rules
    .map(function(r) {
      if (r.type === 'rule' && r.selectors[0] == '@font-face') {
        return r.declarations.map(function(d) {
          var m = woffURL.exec(d.value)
          if (m)
            return {
              declaration: d,
              filename: m[2]
                .replace(/\?.*/, '')
                .replace(/^'/, '')
                .replace(/'$/, '')
            }
        }).filter(Boolean)[0]
      }
    })
    .filter(Boolean)
    .map(function(task) {
      var filename = path.resolve(path.dirname(mod.id), task.filename)
      return readFile(filename, {encoding: 'base64'})
        .then(function(data) {
          task.declaration.value = (
            'url(data:application/woff;charset=utf-8;base64,' +
            data + ") format('woff')")
        })
    })

  return q.all(rewrites).then(function() { return {source: css.stringify(ast)} })
}
