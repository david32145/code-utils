const crypto = require("crypto")

class Subject {
  observableList = []

  constructor() {
    this.observableList = []
  }

  subscribe(handler) {
    const id = crypto.randomBytes().toString()
    this.observableList.push({
      id,
      handler
    })
    return id
  }

  unsubscribe(observableId) {
    this.observableList.filter(observable => observable.id !== observableId)
  }

  publish(subject) {
    this.notifyAll(subject)
  }

  notifyAll(subject) {
    this.observableList.forEach(observable => {
      observable.handler(subject)
    })
  }
}

module.exports = Subject
