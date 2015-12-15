var test = require('tape')
var tail = require('../')

test('errors if file doesnt exist', function (t) {
  var s = tail('doesnt exist')
  s.on('error', function (err) {
    t.equals(err.code, 'ENOENT', 'errors if file doesnt exist')
    t.end()
  })
})

test('doesnt error if ended already and file doiesnt exist', function (t) {
  var s = tail('doesnt exist')
  s.on('end', function () {
    t.ok(1, 'ended')
    setImmediate(function () {
      t.end()
    })
  })

  s.on('error', function (err) {
    console.log('errororor!')
    t.fail('shouldnt emit error ' + err)
  })
  s.on('data', function () {})
  s.end()
})
