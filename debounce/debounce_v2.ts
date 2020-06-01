export default function debounce(callback: Function, time: number) {
  let timeoutId = null

  return function debounceWrapper(...params: any[]): void {
    if(timeoutId) {
      // Tem um timeout em progress, temos que limpra ele
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      callback(...params)
      timeoutId = null // Aqui a função já executou e podemos libera para novas interações
    }, time)
  }
}