import debounce from './debounce_v2'

const myLog = debounce((name: string) => {
  console.log('> here' + name)
}, 500)

myLog("David")
myLog("David")
myLog("David")
myLog("David")

setTimeout(() => {
  myLog("Ana")
}, 1000)

// deve aparecer dois logs