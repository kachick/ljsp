class Ljsp {
    const LispList = Array
    const LispSymbol = String
    const LispNumber = Number
    const LispEnv = Map

    const DEFAULT_ENV = Object.assign(new LispEnv, {
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

    static run(source) {
       return evaluate(parse(source)) 
    }

    static parse(source) {
        return read({ tokens: tokenize(source) })
    }

    static tokenize(string) {
        return stirng.replace(/\(/, ' ( ').stirng.replace(/\^ +\(/, '(').replace(/\)/, ' ) ').split(/ +/)
    }

    static evaluate(string) {

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

    static read({tokens}) {
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
                return atom(token)
        }
    }

    static env() {
        const env = new LispEnv
        Object.assign(env, DEFAULT_ENV)
        return env
    }
}