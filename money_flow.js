const { ipcRenderer } = require("electron")


class MoneyFlow {
    constructor(div, type) {
        this.div = div
        this.type = type
        this.data
        this.addForm

        ipcRenderer.send('get', this.type)
        ipcRenderer.on(this.type + 'Reply', (event, data) => {
            this.data = data
            this.populate()
        })
    }

    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    populate() {
        this.div.innerHTML = ''

        this.createHeader()
        this.createAddButton()
        this.createAddForm()
        this.createSourcesDiv()
    }

    createHeader() {
        let header = document.createElement('h1')
        header.innerText = this.capitalize(this.type)
        this.div.appendChild(header)
    }

    createAddButton() {
        let addSourceButton = document.createElement('button')
        addSourceButton.innerText = 'Add ' + this.capitalize(this.type)
        addSourceButton.addEventListener('click', () => this.toggleFormVisibility())
        this.div.appendChild(addSourceButton)
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

        this.addForm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.addSource({
                'source': sourceInput.value,
                'amount': parseFloat(amountInput.value).toFixed(2)
            })
        })

        this.div.appendChild(this.addForm)
    }

    createSourcesDiv() {
        let sourcesDiv = document.createElement('div')
        this.data.forEach((source => {
            const header = document.createElement('h2')
            header.innerText = source.source
            const amount = document.createElement('p')
            amount.innerText = source.amount
            sourcesDiv.appendChild(header)
            sourcesDiv.appendChild(amount)
        }))
        this.div.appendChild(sourcesDiv)
    }

    toggleFormVisibility() {
        this.addForm.removeAttribute('hidden')
    }

    addSource(source) {
        this.data.push(source)
        this.saveData()
    }

    saveData() {
        ipcRenderer.send('set', { 'key': this.type, 'value': this.data })
    }
}

module.exports = MoneyFlow