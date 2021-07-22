const { ipcRenderer } = require("electron")
const MoneyFlow = require('./money_flow.js')

class Expense extends MoneyFlow {
    constructor(div) {
        super(div, 'expense')
    }

    createAddForm() {
        this.addForm = document.createElement('form')
        this.addForm.setAttribute('hidden', '')

        let sourceLabel = document.createElement('label')
        sourceLabel.innerText = 'Source:'
        this.addForm.appendChild(sourceLabel)
        this.addForm.appendChild(document.createElement('br'))

        let sourceInput = document.createElement('input')
        sourceInput.setAttribute('type', 'text')
        this.addForm.appendChild(sourceInput)
        this.addForm.appendChild(document.createElement('br'))

        let amountLabel = document.createElement('label')
        amountLabel.innerText = 'Amount:'
        this.addForm.appendChild(amountLabel)
        this.addForm.appendChild(document.createElement('br'))

        let amountInput = document.createElement('input')
        amountInput.setAttribute('type', 'number')
        this.addForm.appendChild(amountInput)
        this.addForm.appendChild(document.createElement('br'))

        let withdrawalDateDiv = document.createElement('div')
        withdrawalDateDiv.setAttribute('hidden', '')

        let automaticLabel = document.createElement('label')
        automaticLabel.innerText = 'Automatic Withdrawal?'
        this.addForm.appendChild(automaticLabel)
        this.addForm.appendChild(document.createElement('br'))

        let automaticInput = document.createElement('input')
        automaticInput.setAttribute('type', 'checkbox')
        automaticInput.addEventListener('click', () => this.toggleAutomaticVisibility(automaticInput, withdrawalDateDiv))
        this.addForm.appendChild(automaticInput)
        this.addForm.appendChild(document.createElement('br'))

        this.addForm.appendChild(withdrawalDateDiv)

        let withdrawalDateLabel = document.createElement('label')
        withdrawalDateLabel.innerText = 'Day of Withdrawal (1-31):'
        withdrawalDateDiv.appendChild(withdrawalDateLabel)

        let withdrawalDateInput = document.createElement('input')
        withdrawalDateInput.setAttribute('type', 'number')
        withdrawalDateInput.setAttribute('min', '1')
        withdrawalDateInput.setAttribute('max', '31')
        withdrawalDateDiv.appendChild(withdrawalDateInput)

        let submitButton = document.createElement('input')
        submitButton.setAttribute('type', 'submit')
        submitButton.setAttribute('hidden', '')
        this.addForm.appendChild(submitButton)

        this.addForm.addEventListener('submit', (e) => this.addSource(e, sourceInput.value, amountInput.value, automaticInput.value, withdrawalDateInput.value))

        this.div.appendChild(this.addForm)
    }

    createSourcesDiv() {
        let sourcesDiv = document.createElement('div')
        this.data.forEach((source => {
            const header = document.createElement('h2')
            header.innerText = source.source
            sourcesDiv.appendChild(header)

            const amount = document.createElement('p')
            amount.innerText = source.amount
            sourcesDiv.appendChild(amount)

            if (source.withdrawalDate > 0) {
                const withdrawalDateText = document.createElement('p')
                withdrawalDateText.innerText = 'Normally withdrawn on the ' + source.withdrawalDate + ' of every month.'
                sourcesDiv.appendChild(withdrawalDateText)
            }
            else {
                const paidCheck = document.createElement('div')
                const paidCheckText = document.createElement('p')
                const paidCheckBox = document.createElement('input')
                paidCheck.appendChild(paidCheckText)
                paidCheck.appendChild(paidCheckBox)
                sourcesDiv.appendChild(paidCheck)
                paidCheckText.innerText = 'Have you paid this for the month of ' + new Date().toLocaleString('default', { month: 'long' }) + '?'
                paidCheckBox.setAttribute('type', 'checkbox')
                console.log(source.paidForMonth)
                if (source.paidForMonth)
                    paidCheckBox.checked = true
                paidCheckBox.addEventListener('change', () => this.togglePaid(source, paidCheckBox))
            }
        }))
        this.div.appendChild(sourcesDiv)
    }

    togglePaid(expenseSource, paidCheckBox) {
        this.data.find((expense, i) => {
            if (expense.source === expenseSource.source) {
                this.data[i] = {
                    'source': expenseSource.source,
                    'amount': expenseSource.amount,
                    'withdrawalDate': expenseSource.withdrawalDate,
                    'paidForMonth': paidCheckBox.checked
                }
            }
        })
        this.saveData()
    }

    toggleAutomaticVisibility(automaticInput, withdrawalDateDiv) {
        if (automaticInput.checked)
            withdrawalDateDiv.removeAttribute('hidden')
        else
            withdrawalDateDiv.setAttribute('hidden', '')
    }

    addSource(e, source, amount, automatic, withdrawalDate) {
        e.preventDefault()

        if (!automatic)
            withdrawalDate = 0
        this.data.push({
            'source': source,
            'amount': parseFloat(amount).toFixed(2),
            'withdrawalDate': withdrawalDate,
            'paidForMonth': false
        })
        this.saveData()
    }
}

module.exports = Expense