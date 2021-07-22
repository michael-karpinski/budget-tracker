const { ipcRenderer, remote } = require('electron')
const dialog = remote.dialog


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

    /**
     * Capitalize the first letter of a String.
     * @param {String} text Text to capitalize.
     * @returns             Capitalized text.
     */
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    /**
     * Populate the view for this flow.
     */
    populate() {
        this.div.innerHTML = ''

        this.createHeader()
        this.createAddButton()
        this.createAddForm()
        this.createExpensesDiv()
    }

    /**
     * Create header - h1 element whose text is the type of flow.
     */
    createHeader() {
        let header = document.createElement('h1')
        header.innerText = this.capitalize(this.type)
        this.div.appendChild(header)
    }

    /**
     * Create add button, which displays add form when clicked.
     */
    createAddButton() {
        let addSourceButton = document.createElement('button')
        addSourceButton.innerText = 'Add ' + this.capitalize(this.type)
        addSourceButton.addEventListener('click', () => this.toggleFormVisibility())
        this.div.appendChild(addSourceButton)
    }

    /**
     * Create add form - when submitted, parse input and add new source to data list.
     */
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
            this.addFlow({
                'source': sourceInput.value,
                'amount': parseFloat(amountInput.value).toFixed(2)
            })
        })

        this.div.appendChild(this.addForm)
    }

    /**
     * Create and populate display for this flow's sources.
     */
    createExpensesDiv() {
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

    /**
     * Show add form.
     */
    toggleFormVisibility() {
        this.addForm.removeAttribute('hidden')
    }

    /**
     * After validating source name is unique, add income source to data array and save.
     * If source name is not unique, display error message to user.
     * @param {Object} source Income source to be added.
     */
    addFlow(flow) {
        if (!this.findFlow(flow.source))
            this.data.push(flow)
        else
            dialog.showErrorBox('Error', 'Please enter a unique source name.');
        this.saveData()
    }

    findFlow(source) {
        for (let i = 0; i < this.data.length; i++)
            if (source == this.data[i].source)
                return true
        return false
    }

    /**
     * Send data to back-end for saving.
     */
    saveData() {
        ipcRenderer.send('set', { 'key': this.type, 'value': this.data })
    }
}

module.exports = MoneyFlow