const MoneyFlow = require('./money_flow.js')

class Income extends MoneyFlow {
    constructor(div) {
        super(div, 'income')
    }
}

module.exports = Income