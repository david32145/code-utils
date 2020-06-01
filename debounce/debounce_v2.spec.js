const debounce = require('./debounce_v2')

const myLog = debounce((name) => {
  console.log('> here ' + name)
}, 500)

myLog("david")
myLog("david")
myLog("david")
myLog("david")

setTimeout(() => {
  myLog("ana")
}, 1000)

// deve aparecer dois logs