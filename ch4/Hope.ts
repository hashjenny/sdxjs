import * as assert from "node:assert";

type Level = "terse" | "verse";

class Hope {
  todo: any[];
  pass: any[];
  fails: any[];
  errors: any[];
  level: Level;
  constructor() {
    this.todo = [];
    this.pass = [];
    this.fails = [];
    this.errors = [];
    this.level = "terse";
  }

  test(message: string, callback: () => void) {
    this.todo.push([message, callback]);
  }

  run(level?: Level) {
    this.level = level ?? this.level;
    this.todo.forEach(([message, test]) => {
      try {
        test();
        this.pass.push(message);
      } catch (e) {
        if (e instanceof assert.AssertionError) {
          this.fails.push(message);
        } else {
          this.errors.push(message);
        }
      }
    });
  }

  terse() {
    return this.case().map(([title, results]) => `${title}: ${results.length}`);
  }

  verbose() {
    let report = "";
    let prefix = "";
    for (const [title, results] of this.case()) {
      report += `${prefix}${title}:`;
      prefix = "\n";
      for (const item of results) {
        report += `${prefix}    ${item}`;
      }
    }
    return report;
  }

  case() {
    return [
      ["pass", this.pass],
      ["fails", this.fails],
      ["errors", this.errors],
    ];
  }
}

export default new Hope();
