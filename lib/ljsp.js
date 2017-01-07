const Ljsp = {
    static run(string) {
       evaluate(parse(string)) 
    },

    static tokenize(string) {
        stirng.replace(/\(/, ' ( ').replace(/\)/, ' ) ').split()
    },

    static parse(string) {

    },

    static evaluate(string) {

    },

    static atom(token) {
        if (/^\d+$/.test(token)) {
            Number.parseInt(token)
        } else if (/^\d+\.\d+$/.test(token)) {
            Number.parseFloat(token)
        } else {
            token
        }
    },

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
                break;
            case ')':
                throw 'unexpected ")"'
            default:
                atom(token)
                break;
        }
    }
}