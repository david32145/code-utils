# Obersever

O padrão de projecto _observable_, é um tipo de estrutura que permite que vários _observable_ se escrevam em um _subject_ e sempre que houver uma mudança no _observer_ todos os _observable_ serão notificados. Antes de partir para prática vamos definir melhor _subject_ e _observable_.

- **SUBJECT**: É o objeto de interesse, ou seja, se imaginarmos um context de um chat o subject é uma messagem, onde todos os clientes tem interesse nas messagens;
- **OBSERVABLE**: São os objetos que observam o _subject_, no exemplo de um chat os _observables_ são os clientes (usuários do chat) e como dito acima o _subject_ são as messagens.

## Caso de uso

No nosso caso, como já foi falado acima, é um chat onde têm várias pessoas interessadas em messagens.

## Code I

Primeiro vamos definir nossa interface, ou seja, como as estruturas de dados vão se comportar. Antes disso, vamos definir o comportamento de um _observable_. O que eu espero de um _observable_ é que ele forneça uma forma de executar determinado procedimento sempre que o _subject_. Bom,

```
"executar determinado procedimento"
```

Esse trecho é familiar para quem é programador, não é mesmo? isso é uma função, então o _observable_ pode ser definido simplesmente por uma simples `Function`.

E o _subject_, ele precisa de guardar todos os seus _observable_, como são muitos podemos armazenar os _observable_ em uma lista, em outras palavras uma lista de _observables_, porém além dessa lista o _subject_ deve prover uma forma de inscrição de um observable e desincrição desse mesmo observable, imagine o exemplo do chat, se um usuário sair ele não quer mais receber mensagens, isto é, ele quer se desinscrever do chat. Com isso, temos que o _subject_ é uma estrutura que possui uma lista de _observables_ e dois métodos, um para inscrever e outro para desinscrever determinado _observable_.

Vamos primeiro definir a função _observable_, neste exemplo usarei typescript, porém é fácil de transformar para javascript e além disso, facilita a explicação.

```ts
type ObservableFunction<T> = (subject: T) => void
```

Como o próprio tipo se define, uma função _observable_ tem tipo `T` onde `T` é o tipo do subject e não retorna nada. Novamente, se você não usa typescript a única coisa que pode importar é o código abaixo:

```js
function observable(subject) {
  // code here...
}
```

Agora vamos definir nosso _subject_, o recurso de `class` do javascript se encaixa no nosse requisito perfeitamento (campo, métodos e factories). Nossa class tem a seguinte cara.

```ts
class Subject {
  private obsevableList

  public subscribe()

  public unsubscribe()
}
```

Com relação ao nome da `class`, você pode usar tanto **Subject** quanto **Observer**, porém o `Subject` precisa ter um tipo, um tipo genérico de prefência.

```ts
type ObservableFunction<T> = (subject: T) => void

class Subject<T> {
  private observableList: ObservableFunction<T>[]

  public subscribe(handler: ObservableFunction<T>): string

  public unsubscribe(observableId: string): void
}
```

Bem, agora conseguimos definir mais alguns tipos, porém acho que você notou que o método `subscribe` retorna uma `string` e o `unsubscribe` recebe uma `string`, quando o _observable_ se inscreve ele precisa poder se desinscrever e para isso é preciso uma espécies de _id_, onde o _observable_ pode ser gerenciado. Podemos modificar para seguinte forma:

```ts
type ObservableFunction<T> = (subject: T) => void

interface Observable<T> {
  handler: ObservableFunction<T>
  id: string
}

class Subject<T> {
  private observableList: Observable<T>[]

  public subscribe(handler: ObservableFunction<T>): string

  public unsubscribe(observableId: string): void
}
```

Bem, a modificação foi pouco, basicamente ao invés de armazenar uma lista de funções, é armazenada uma lista de objetos, no caso uma lista de `Observable`.

Além disso, falta duas coisa, uma que informe que um novo subject está disponível e outra que notifica todos os _observables_. Normalmente o nome da função que adiciona um novo subject é `publish` e para notificar os _observables_ é `notifyAll`, então vamos finalizar nossa definição. 

```ts
type ObservableFunction<T> = (subject: T) => void

interface Observable<T> {
  handler: ObservableFunction<T>
  id: string
}

class Subject<T> {
  private observableList: Observable<T>[]

  public subscribe(handler: ObservableFunction<T>): string

  public unsubscribe(observableId: string): void

  public publish(subject: T): void

  private notifyAll(): void
}
```

Como tanto o atributo `observableList` quanto o método `notifyAll` diz respeito somente a class `Subject` então podemos defini-los como privado. Com isso, terminamos nossa definição das estruturas e podemos partir para o código.

## Code II

Vamo focar somente na class `Subject`, pois o _observable_ é somente uma função, o método mais simples é o `subscribe`.

```ts
import crypto from "crypto"

class Subject<T> {
  private observableList: Observable<T>[]

  public subscribe(handler: ObservableFunction<T>): string {
    const id = crypto.randomBytes(8).toString()
    this.observableList.push({
      id,
      handler
    })
    return id
  }
}
```

Para gerar um id aleatório, você pode usar o módulo `crypto` do node, e o método `subscribe` é tão simples quanto adicionar um item em uma lista.

Para remover um _observable_ podemos usar uma função própria das lista que o filter, e podemos filtrar nossa lista de _observable_ por todos que não são aquele que recebemos por parâmetro.

```ts
import crypto from "crypto"

class Subject<T> {
  private observableList: Observable<T>[]

  public unsubscribe(observableId: string): void {
    this.observableList.filter(observable => observable.id !== observableId)
  }
}
```

Com isso finalizamos a função `unsubscribe`.

Vamos fazer a função `publish` e `notifyAll` juntas, não sei se você percebeu, mas a função `notifyAll` que notifica todos os _observables_ e ele em nem um momento recebe o novo _subject_, ou seja, ele precisa receber, ou melhor o `publish` precisa repassar o _subject_ para o `notifyAll`. A função `notifyAll` é apenas iterar por todos os _observables_ chamar a função `.handler` passando o novo `subject`.


```ts
class Subject<T> {

  public publish(subject: T): void {
    this.notifyAll(subject)
  }

  private notifyAll(subject: T): void {
    this.observableList.forEach(observable => {
      observable.handler(subject)
    })
  }
}
```

Com isso, finalizamos nossa implementação do _observable_ pattern e podemos partir para a prática.

Você pode conferir as implementações completas aqui:

- [Javascript](./observable.js)
- [Typescript](./observable.ts)

## Example

Vamos programar um exemplo de um chat, onde usuários trocam messagens, vamos definir a tipagem da messagem.

```ts
interface Message {
  sender: string // Remetente da messagem
  content: string // Conteúdo da messagem
}
```

Agora vamos criar nosso chat.

```ts
const chat = new Subject<Message>()
```

Vamos adicionar três pessoas (john, mary, july).

```ts
const johnId = chat.subscribe((message) => {
  console.log(`> John receive message ${message.content} from ${message.sender}`)
})

const maryId = chat.subscribe((message) => {
  console.log(`> Mary receive message ${message.content} from ${message.sender}`)
})

const julyId = chat.subscribe((message) => {
  console.log(`> July receive message ${message.content} from ${message.sender}`)
})
```

Vamos publicar 2 messagens, do john e da july, porém antes disso precisamos mostrar o `log` somente somente se o `sender` for difente do que publicou, vamos adicionar essas condições.

```ts
const johnId = chat.subscribe((message) => {
  if(message.sender === "john") return
  console.log(`> John receive message ${message.content} from ${message.sender}`)
})

const maryId = chat.subscribe((message) => {
  if(message.sender === "mary") return
  console.log(`> Mary receive message ${message.content} from ${message.sender}`)
})

const julyId = chat.subscribe((message) => {
  if(message.sender === "july") return
  console.log(`> July receive message ${message.content} from ${message.sender}`)
})
```

Agora de fato vamos publicar duas messagens.

```ts
chat.publish({
  sender: "john",
  content: "Hello guys"
})

chat.publish({
  sender: "july",
  content: "What are they doing?"
})
```

É esperado os seguintes logs:

```
> Mary receive message Hello guys from john
> July receive message Hello guys from john
> John receive message What are they doing? from july
> Mary receive message What are they doing? from july
```

Você pode conferir os exemplos em:

- [Javascript](./observable.spec.js)
- [Typescript](./observable.spec.ts)