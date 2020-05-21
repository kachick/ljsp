const isLispList = Array.isArray;
const isLispSymbol = (x: unknown): x is LispSymbol => typeof x === "string";

type LispSymbol = string;
// type LispNumber = number;
// type LispList = any[];

// interface LispEnv {
//   outer: LispEnv | null;
// }

// class LispEnv extends Map implements LispEnv {
//   constructor(
//     iterators: any[][] = [],
//     params: any[] = [],
//     args: any[] = [],
//     outer: LispEnv | null = null
//   ) {
//     super(iterators);

//     params.forEach((param, index) => {
//       this.set(param, args[index]);
//     });
//     this.outer = outer;
//   }
// }

const GLOBAL_ENV = new Map([
  ["+", (x: number, y: number) => x + y],
  ["-", (x: number, y: number) => x - y],
  ["*", (x: number, y: number) => x * y],
  ["/", (x: number, y: number) => x / y],
  ["not", (x: unknown) => !!!x],
  [">", (x: unknown, y: unknown) => x > y],
  ["<", (x: unknown, y: unknown) => x < y],
  [">=", (x: unknown, y: unknown) => x >= y],
  ["<=", (x: unknown, y: unknown) => x <= y],
  ["=", (x: unknown, y: unknown) => x === y],
  ["equal?", (x: unknown, y: unknown) => x === y],
  ["eql?", (x: unknown, y: unknown) => Object.is(x, y)],
  ["length", (x: any) => x.length],
  ["cons", (x: unknown, y: unknown) => [x, y]],
  ["car", (x: any[], _y: unknown) => x[0]],
  ["cdr", (x: any[], _y: unknown) => x.slice(1)],
  ["append", (x: unknown[], y: unknown[]) => [...x, ...y]],
  ["list", (...x: unknown[]) => x],
  ["list?", (x: unknown) => isLispList(x)],
  ["null?", (x: any) => x.length === 0],
  ["symbol?", (x: unknown) => isLispSymbol(x)],
  ["begin", (...x: unknown[]) => x[x.length - 1]],
]);

export class Ljsp {
  static run(source: string) {
    return this.evaluate(this.parse(source));
  }

  static parse(source: string) {
    return this.read(this.tokenize(source));
  }

  static tokenize(string: string): string[] {
    return string
      .replace(/\(/g, " ( ")
      .replace(/^ +\(/, "(")
      .replace(/\)/g, " ) ")
      .replace(/\) +$/, ")")
      .split(/ +/);
  }

  static evaluate(x: unknown, env = GLOBAL_ENV): unknown {
    if (isLispSymbol(x)) {
      return env.get(x);
    } else if (!isLispList(x)) {
      return x;
    } else if (x[0] == "if") {
      const [_, test, conseq, alt, ..._rest] = x;
      const exp: unknown = this.evaluate(test, env) ? conseq : alt;
      return this.evaluate(exp, env);
    } else if (x[0] == "define") {
      const [_, v, exp, ..._rest] = x;
      env.set(v, this.evaluate(exp, env) as any);
    } else {
      const proc: any = this.evaluate(x[0], env);
      const args: unknown[] = x
        .slice(1)
        .map((element) => this.evaluate(element, env));
      return proc(...args);
    }
  }

  static atom(token: string) {
    if (/^\d+$/.test(token)) {
      return Number.parseInt(token);
    } else if (/^\d+\.\d+$/.test(token)) {
      return Number.parseFloat(token);
    } else {
      return token;
    }
  }

  static read(tokens: string[]) {
    if (tokens.length == 0) {
      throw "unexpected EOF while reading";
    }

    const token = tokens.shift();
    switch (token) {
      case "(":
        const l: any[] = [];
        while (tokens[0] !== ")") {
          l.push(this.read(tokens));
        }
        tokens.shift(); // pop off ')'
        return l;
      case ")":
        throw 'unexpected ")"';
      default:
        return this.atom(token);
    }
  }

  static repl(prpmpt = "ljsp> ") {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (chunk) => {
      if (!/\S/.test(chunk.toString())) {
        return process.stdout.write(prpmpt);
      }
      const val = this.evaluate(this.parse(chunk.toString()));
      return process.stdout.write(prpmpt + this.schemestr(val));
    });
  }

  static schemestr(exp: unknown): string {
    if (isLispList(exp)) {
      return `( ${exp.map((e) => Ljsp.schemestr(e)).join("")})`;
    } else {
      return exp.toString();
    }
  }
}
