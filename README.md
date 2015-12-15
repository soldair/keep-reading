# keep-reading
keep reading a file. like tail but with no concept of lines and no watching.

```js
var tail = require('keep-reading')

var stream = tail('/var/log/some.log')

stream.on('data',function(buf){
  console.log(buf,'is the data read from the file.')
  console.log(buf.offset,'is the byte offset of the bufers starting position in the file')
})

stream.on('waiting',function(duration){
  console.log('will wait for ',duration,'ms before checking to see if the file has more data. exponential backoff')
})

stream.on('open',function(fd){
  console.log(fd,'is the file descriptor being read')
})

stream.on('close',function(){
  console.log('the file descriptor is closed. always fires after end.')
})

```


  

