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