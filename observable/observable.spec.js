const Subject = require("./observable")

const chat = new Subject()

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

chat.publish({
  sender: "john",
  content: "Hello guys"
})

chat.publish({
  sender: "july",
  content: "What are they doing?"
})

