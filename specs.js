var transform = require('./index'),
    assert = require('assert'),
    dgraph = require('dgraph'),
    pack = require('css-pack'),
    aggregate = require('stream-aggregate-promise');

describe('dgraph-css-inline-woff', function() {

  it('inlines woff fonts as base64 encoded data URIs', function(done) {
    var graph = dgraph(
          require.resolve('font-awesome/css/font-awesome.css'),
          {
            transform: transform,
            noParse: function(id) { return id.match(/\.css$/); }
          }),
        packer = pack();

    graph
      .on('error', function(err) { packer.emit('error', err); })
      .pipe(packer);

    aggregate(packer)
      .then(function(source) {
        assert.ok(source.indexOf('base64') > -1)
        assert.ok(source.indexOf('fontawesome-webfont.woff') == -1)
        done()
      })
      .fail(done)
      .end()
  });

});
