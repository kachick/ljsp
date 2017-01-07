class Ljsp {
    // const List = Array
    // const Symbol = String
    // const Number = Number
    // const Env = Map/Object

    static run(source) {
       return evaluate(parse(source)) 
    }

    static tokenize(string) {
        return stirng.replace(/\(/, ' ( ').stirng.replace(/\^ +\(/, '(').replace(/\)/, ' ) ').split(/ +/)
    }

    static parse(source) {
        return read({ tokens: tokenize(source) })
    }

    static evaluate(string) {

    }

    static atom(token) {
        if (/^\d+$/.test(token)) {
            return Number.parseInt(token)
        } else if (/^\d+\.\d+$/.test(token)) {
            return Number.parseFloat(token)
        } else {
            return token
        }
    }

    static read({tokens}) {
        if (tokens.empty()) {
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
}