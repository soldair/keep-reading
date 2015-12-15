var fs = require('fs')
var test = require('tape')
var tail = require('../')
var common = require('./helper')
var eos = require('end-of-stream')

var clean = common.clean()

test("can tail file?",function(t){

  t.plan(3)

  var f = './'+Date.now()+'.test'
  clean.push(f)

  var ws = fs.createWriteStream(f)
  var s = tail(f)

  var written = []
  var read = []
  var readBytes = 0

  s.on('data',function(b){
    readBytes += b.length
    read.push(b)
    if(readBytes === 300) s.end()
  })

  eos(s,function(err){
    if(err) throw err

    console.log('ended!')

    written = Buffer.concat(written)+''
    read = Buffer.concat(read)+''

    t.equals(written.length,read.length,'should have read everything that was written')
  })

  s.once('waiting',function(time){
    t.equals(time,100,'first wiating event should be for 100ms')
  })

  s.on('close',function(){
    t.ok(1,'the fd was closed!')
  })

  function w(data){
    written.push(data)
    ws.write(data)
  }

  var timer
  var writes = 0;
  timer = setInterval(function(){
    w(new Buffer('hi\n'))
    writes ++
    if(writes === 100) {
      clearInterval(timer)
    }
  },10)  

})
