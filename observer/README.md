# Obersever

O padrão de projecto _observable_, é um tipo de estrutura que permite que vários _observable_ se escrevam em um _subject_ e sempre que houver uma mudança no _observer_ todos os _observable_ serão notificados. Antes de partir para prática vamos definir melhor _subject_ e _observable_.

- **SUBJECT**: É o objeto de interesse, ou seja, se imaginarmos um context de um chat o subject é uma messagem, onde todos os clientes tem interesse nas messagens;
- **OBSERVABLE**: São os objetos que observam o _subject_, no exemplo de um chat os _observables_ são os clientes (usuários do chat) e como dito acima o _subject_ são as messagens.