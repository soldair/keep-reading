var fs = require('fs')
var test = require('tape')
var path = require('path')
var tail = require('../')
var common = require('./helper')
var clean = common.clean()

test('doesnt stream if ended already', function (t) {
  var f = path.join(__dirname, '' + Date.now())
  fs.writeFileSync(f, 'hi')
  clean.push(f)
  var s = tail(f)

  s.on('error', function () {})

  s.on('open', function () {
    t.fail('should not emit open if closed already')
  })

  s.on('end', function () {
    t.ok(1, 'ended')
    setImmediate(function () {
      t.end()
    })
  })

  s.on('data', function () {})

  s.end()
})
