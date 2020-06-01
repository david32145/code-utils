module.exports = function debounce(callback, time){
  let timeoutId = null

  return function debounceWrapper() {
    if(timeoutId) {
      // Tem um timeout em progress, temos que limpra ele
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      callback()
      timeoutId = null // Aqui a função já executou e podemos libera para novas interações
    }, time)
  }
}