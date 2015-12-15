var fs = require('fs')
var eos = require('end-of-stream')
var through2 = require('through2')
var Backo = require('backo')

// dont stop reading this file and writing it's data to the output stream.
module.exports = keepReading

function keepReading (file, start) {
  var backoff = new Backo({min: 100, max: 5000})
  var ending = false
  var fd
  var timeout

  start = +start || -1
  // must be an object stream of buffers because we set offset property to identify where in the file this buffer starts.
  var s = through2.obj(function (chunk, enc, cb) {
    chunk.offset = start
    start += chunk.length
    backoff.reset()
    cb(false, chunk)
  },function(cb){
    ending = true;
    clearTimeout(timeout)
    if(fd) {
      fs.close(fd, function () {
        // handle close error... can this error in a way that results in an fd leak?
        cb()
        setImmediate(function(){
          s.emit('close')
        })
      })
    } else {
      cb()
    }
  })

  makeStream(start)

  return s

  function makeStream () {

    if(ending) return;

    if (!fd) {
      fs.open(file,'r',function (err,_fd) {
        if(ending) {
          if(_fd) fs.close(_fd);
          return
        }
        if(err) return s.emit('error',err)

        fd = _fd
        s.emit('open', fd)
        stream()
      })
    } else {
      stream()
    } 

    function stream(){
      // start is inclusive
      var opts = {start: start + 1}
      // reuse fd and do not close it when read stream is done.
      opts.autoClose = false
      opts.fd = fd

      var rs = fs.createReadStream(file, opts)
      rs.pipe(s, {end: false})

      eos(rs, function (err) {
        if (err) return s.emit('error', err)
        if(ending) return;

        var wait = backoff.duration()
        s.emit('waiting',wait)
        timeout = setTimeout(function () {
          makeStream()
        }, wait)
      })
    }
  }
}
