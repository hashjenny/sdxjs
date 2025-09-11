import * as assert from "node:assert"

export type Level = "terse" | "verse"

type TestResult = {
  result: "pass" | "fail" | "error"
  message: string
  time: bigint
}

type Case = [string, TestResult[]]

type TodoItem = [string, () => void | Promise<void>, string[]?]

type TestParameter<T, V> = [T[], V]

class Hope {
  todo: TodoItem[]
  testResults: TestResult[]
  level: Level
  setupFn: (() => void)[]
  teardownFn: (() => void)[]
  constructor() {
    this.todo = []
    this.testResults = []
    this.level = "verse"
    this.setupFn = []
    this.teardownFn = []
  }

  setup(...fns: (() => void)[]) {
    this.setupFn.push(...fns)
  }

  teardown(...fns: (() => void)[]) {
    this.teardownFn.push(...fns)
  }

  test(message: string, callback: () => void | Promise<void>, tagList?: string[]) {
    this.todo.push([message, callback, tagList])
  }

  multiTest<T, V>(message: string, fn: (...args: any[]) => any, args: TestParameter<T, V>[], tagList?: string[]) {
    for (const [input, expected] of args) {
      this.todo.push([message, () => assert.equal(fn(...input), expected), tagList])
    }
  }

  async run(tag?: string, level: Level = "verse") {
    this.level = level ?? this.level
    this.setupFn.forEach((fn) => fn())

    for (const [message, callback, tagList] of this.todo) {
      if (tag) {
        if (tagList && tagList.includes(tag)) {
          await this.runTest(message, callback)
        }
      } else {
        await this.runTest(message, callback)
      }
    }
    if (this.level === "terse") {
      console.log(this.terse().join("\n"))
    } else {
      console.log(this.verbose())
    }

    this.teardownFn.forEach((fn) => fn())
  }

  private async runTest(message: string, callback: () => void | Promise<void>) {
    const t = process.hrtime.bigint()
    try {
      const r = callback()
      if (r instanceof Promise) {
        await r
      }
      this.testResults.push({
        result: "pass",
        message: message,
        time: (process.hrtime.bigint() - t) / 1000n,
      })
    } catch (e) {
      if (e instanceof assert.AssertionError) {
        this.testResults.push({
          result: "fail",
          message: message,
          time: (process.hrtime.bigint() - t) / 1000n,
        })
      } else {
        this.testResults.push({
          result: "error",
          message: message,
          time: (process.hrtime.bigint() - t) / 1000n,
        })
      }
    }
  }

  terse() {
    return this.case.map(([resultTitle, results]) => `${resultTitle}: ${results.length}`)
  }

  verbose() {
    let report = ""
    let prefix = ""
    for (const [title, results] of this.case) {
      report += `${prefix}${title}:`
      prefix = "\n"
      for (const item of results) {
        report += `${prefix}    ${item.message} (${item.time}ms)`
      }
    }
    return report
  }

  get case() {
    return [
      ["pass", this.testResults.filter(({ result }) => result === "pass")] as Case,
      ["fails", this.testResults.filter(({ result }) => result === "fail")] as Case,
      ["errors", this.testResults.filter(({ result }) => result === "error")] as Case,
    ]
  }
}

export default new Hope()
