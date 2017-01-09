 'use static';

    const LispList = Array
    const LispSymbol = String
    const LispNumber = Number
    class LispEnv extends Map {
        constructor(params = [], args = [], outer=null) {
            super()

            params.forEach((param, index) => {
                this.set(param, args[index])
            })
            this.outer = outer
        }

        find(param) {
            return (this.has(param) ? this : this.outer)
        }
    }

    const GLOBAL_ENV = Object.assign(new LispEnv, {
        '+': (x, y) => { x + y },
        '-': (x, y) => { x - y },
        '*': (x, y) => { x * y },
        '/': (x, y) => { x / y },
        'not': (x) => { !!!x },
        '>': (x, y) => { x > y },
        '<': (x, y) => { x < y },
        '>=': (x, y) => { x >= y },
        '<=': (x, y) => { x <= y },
        '=': (x, y) => { x === y },
        'equal?': (x, y) => { x === y },
        'eql?': (x, y) => { Object.is(x, y) },
        'length': (x) => { x.length },
        'cons': (x, y) => { [x, y] },
        'car': (x, y) => { x[0] },
        'cdr': (x, y) => { x.slice(1) },
        'append': (x, y) => { [...x, ...y] },
        'list': (...x) => { x },
        'list?': (x) => { x instanceof LispList },
        'null?': (x) => { x.length === 0 },
        'symbol?': (x) => { x instanceof LispSymbol }
    })

class Ljsp {


    static run(source) {
       return this.evaluate(this.parse(source)) 
    }

    static parse(source) {
        return this.read({ tokens: this.tokenize(source) })
    }

    static tokenize(string) {
        return string.replace(/\(/, ' ( ').replace(/\^ +\(/, '(').replace(/\)/, ' ) ').split(/ +/)
    }

    static evaluate(x, env=GLOBAL_ENV) {
        if (x instanceof LispSymbol) {
            return env[x]
        } else if (!(x instanceof LispList)) {
            return x
        } else if (x[0] == 'if') {
            [_, test, conseq, alt, ...rest] = x
            exp = this.evaluate(test, env) ? conseq : alt
            return this.evaluate(exp, env) 
        } else if (x[0] == 'define') {
            [_, v, exp, ...rest] = x
            env[v] = this.evaluate(exp, env)
            return undefined
        } else {
            proc = this.evaluate(x[0], env)
            args = x.slice(1).map((element) => { this.evaluate(element, env)})
            proc.call(...args)
        }
    }

    static atom(token) {
        if (/^\d+$/.test(token)) {
            return LispNumber.parseInt(token)
        } else if (/^\d+\.\d+$/.test(token)) {
            return LispNumber.parseFloat(token)
        } else {
            return token
        }
    }

    static read({ tokens }) {
        if (tokens.length == 0) {
            throw 'unexpected EOF while reading'
        }
        
        const token = tokens.shift()
        switch (token) {
            case '(':
                l = []
                while (tokens[0] != ')') {
                    l.push(read({ tokens: tokens }))
                }
                tokens.shift() // pop off ')'
                return l
            case ')':
                throw 'unexpected ")"'
            default:
                return this.atom(token)
        }
    }

    static env() {
        const env = new LispEnv
        Object.assign(env, DEFAULT_ENV)
        return env
    }

    static repl(prpmpt='ljsp> ') {
        process.stdin.resume()
        process.stdin.setEncoding('utf8')

        process.stdin.on('data', (chunk) => {
            val = this.evaluate(this.parse(chunk))
            process.stdout.write(prpmpt + this.schemestr(val))
        })
    }

    static schemestr(exp) {
        if (x instanceof LispList) {
            return `( ${ exp.map((e) => { schemestr(e) }).join('') })`
        } else {
            return exp.toString()
        }
    }
}