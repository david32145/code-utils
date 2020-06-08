import crypto from "crypto"

type ObservableFunction<T> = (subject: T) => void

interface Observable<T> {
  handler: ObservableFunction<T>
  id: string
}

class Subject<T> {
  private observableList: Observable<T>[]

  public constructor() {
    this.observableList = []
  }

  public subscribe(handler: ObservableFunction<T>): string {
    const id = crypto.randomBytes(8).toString()
    this.observableList.push({
      id,
      handler
    })
    return id
  }

  public unsubscribe(observableId: string): void {
    this.observableList.filter(observable => observable.id !== observableId)
  }

  public publish(subject: T): void {
    this.notifyAll(subject)
  }

  private notifyAll(subject: T): void {
    this.observableList.forEach(observable => {
      observable.handler(subject)
    })
  }
}

export default Subject
