import debounce from './debounce_v1'

const myLog = debounce(() => {
  console.log('> here')
}, 500)

myLog()
myLog()
myLog()
myLog()

setTimeout(() => {
  myLog()
}, 1000)

// deve aparecer dois logs