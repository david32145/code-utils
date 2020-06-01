# Debounce

`Debounce` é uma funcionalidade que certamente você já se deparou. Imagine aquele código que você só quer executar de 2 em 2 segundo, mas não que seja infinito, somente quando o usuário requisitar. Por exemplo, em campo de texto de o cliente faz busca, mas você não quer fazer uma chamada a API sempre que o uma letra mudar, por exemplo, você só que seja feito de 1 em 1 segundo para não sobrecarregar seu servidor.

## Caso de uso

- Busca em tempo real em um input.

## Code I

Primeiro vamos definir assinatura da nossa função:

```ts
function debounce(callback: Function, time: number);
```

Primeiro recebemos uma função de `callback` para ser chamada, porém ela só vai chamada quando um determinado `time`, se houver outra chamada dessa função dentro desse `time` deve se começar o contagem do zero novamente.

Vamos primeiro fazer o simples, fazer essa função de callback dispara depois de um determinado tempo.

```ts
function debounce(callback: Function, time: number){
  setTimeout(() => {
    callback()
  }, time)
}
```

Simples não é mesmo, porém se ela for chamada 10 vezes dentro de 1 segundo, o callback será executado 10 vezes, não é isso o comportamento esperado.

Por sorte, o `javascript` retorna um `id` no retorno do `setTimeout`, e adivinha? você pode cancelar o `setTimeout` com esse `id`.

Então vamos lá, se houver um `setTimeout` em andamento criamos um novo e removemos aquele antigo. Assim, nunca vão haver dois `setTimeout` dentro de uma time e resolvemos a primeira parte do nosso problema.

Porém da maneira que está hoje teriamos que armazenar essa variável de controle (para controlar os `setTimeout`) de maneira global e isso não é legal, nesse sentido vamos utilizar um conceito de encapsulamento onde a variável de controles (e outras fortuitamente) será armazenada. No `javascript` é fácil fazer isso, basta criar uma função dentro de outra função.

```ts
function debounce(callback: Function, time: number){
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
```

Perceba que retornamos uma função para que possamos fazer o uso dela mais tarde, o time fica em um lugar global, mas apenas dentro do nossa função `debounce`. Sempre que chamamos a função `debounce` ela retorna outra função, essa função pode ser chamada 1000 vezes, mas se estiver dentro do tempo passado só será chamanda o `callback` apenas uma vezes. Se você rodar esse comando no seu terminal só aperecerá apenas uma log.

```ts
const logFunc = debouce(() => {
  console.log('> log')
}, 1000)

logFunc()
logFunc()
logFunc()
logFunc()
logFunc()
logFunc()
```

Perceba que como a função foi chamada 6 vezes dentro de 1 segundo, ele vai controlar a quantidade vezes que meu `callback` está sendo chamado.


```ts
function debounce(callback: Function, time: number){
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
```

Sempre que há um `timeoutId` (ou seja ele é diferente de `null`), é removido aquele `setTimeout` e se cria um novo atribuindo o seu `id` de retorno ao `timeoutId`. Quando a função de `callback` é executada eu posso limpar o `timeoutId` e dessa vez não preciso usar a função `clearTimeout`. Assim terminamos a primeira parte da nossa função de debounce.

Você pode conferir esse código em `typescript` ou `javascript`

- [Typescript](./debounce_v1.ts);
- [Javascript](./debounce_v1.js).

Você também pode conferir os código de teste em `typescript` ou `javascript`

- [Typescript](./debounce_v1.spec.ts)
- [Javascript](./debounce_v1.spec.js)

## Code II

Vamos fazer um pequeno ajuste, nada de muito difícil, porém fazer isso logo de cara poderia causar um pouco de confusão. Caso você não tenha percebido se essa não é possível passar parâmentros para dentro de nosso `callback`. Precisamos de uma forma de repassar todos os argumentos da função `debounceWrapper` para a chamada de nosso `callback`, para nossa sorte (de novo) o `javascript` implementa isso, como no exemplo:

```ts
function f1(callback: Function){
  return function f2(...parms: any[]) {
    callback(...params)
  }
}

const func = f1((age, name) => {
  console.log(age, name)
})

func(19, 'mayk') // 19 mayk
func(27, 'ana') // 27 ana
```

Então basta agora refatorar nosso código:

```ts
function debounce(callback: Function, time: number){
  let timeoutId = null

  return function debounceWrapper(...params: any[]) {
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
```

Agora sim, finalizamos nossa função de debounce.

Você pode conferir esse código em `typescript` ou `javascript`

- [Typescript](./debounce_v2.ts);
- [Javascript](./debounce_v2.js).

Você também pode conferir os código de teste em `typescript` ou `javascript`

- [Typescript](./debounce_v2.spec.ts)
- [Javascript](./debounce_v2.spec.js)

Você também pode conferir um exemplo em html, com o caso de uso proposto acima.

- [Html Exemplo](./debounce.html)
