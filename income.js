const { ipcRenderer } = require("electron")


class Income {
    constructor(incomeDiv) {
        this.incomeDiv = incomeDiv
        this.data
        this.addForm

        ipcRenderer.send('get', 'income')
        ipcRenderer.on('incomeReply', (event, data) => {
            this.data = data
            this.populate()
        })
    }

    populate() {
        this.incomeDiv.innerHTML = ''

        this.createHeader()
        this.createAddButton()
        this.createAddForm()
        this.createSourcesDiv()
    }

    createHeader() {
        let header = document.createElement('h1')
        header.innerText = 'Income'
        this.incomeDiv.appendChild(header)
    }

    createAddButton() {
        let addIncomeButton = document.createElement('button')
        addIncomeButton.innerText = 'Add Income'
        addIncomeButton.addEventListener('click', () => this.toggleFormVisibility())
        this.incomeDiv.appendChild(addIncomeButton)
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

        let submitButton = document.createElement('input')
        submitButton.setAttribute('type', 'submit')
        submitButton.setAttribute('hidden', '')
        this.addForm.appendChild(submitButton)

        this.addForm.addEventListener('submit', (e) => this.addSource(e, sourceInput.value, amountInput.value))

        this.incomeDiv.appendChild(this.addForm)
    }

    createSourcesDiv() {
        let sourcesDiv = document.createElement('div')
        this.data.forEach((source => {
            const header = document.createElement('h2')
            header.innerText = source.src
            const amount = document.createElement('p')
            amount.innerText = source.income
            sourcesDiv.appendChild(header)
            sourcesDiv.appendChild(amount)
        }))
        this.incomeDiv.appendChild(sourcesDiv)
    }

    toggleFormVisibility() {
        this.addForm.removeAttribute('hidden')
    }

    addSource(e, source, amount) {
        e.preventDefault()
        console.log('ADDING SOURCE')
        this.data.push({
            'src': source,
            'income': amount
        })
        this.saveData()
    }

    saveData() {
        ipcRenderer.send('set', { 'key': 'income', 'value': this.data })
    }
}

module.exports = Income