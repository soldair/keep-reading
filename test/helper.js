var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
module.exports = {}
module.exports.clean = function(){


  var files = []
  function clean (err) {
    var start = files.length;
    while(files.length) {
      try {
        rimraf.sync(files.shift())
      } catch(e) {
        if(files.length === start) throw e    
      }
    }
    if (err) process.emit('error', err)
  }

  clean.push = function(){
    files.push.apply(files,arguments)
  }

  process.once('uncaughtException', clean)
  process.once('exit', clean)


  return clean
}
