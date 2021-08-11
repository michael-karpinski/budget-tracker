const MoneyFlow = require('./money_flow.js')

class Expense extends MoneyFlow {
    constructor(div) {
        super(div, 'expense')
    }

    /**
     * Create add form - when submitted, parse input and add new expense to list.
     * 
     * Compared to parent class, this includes input and some logic for automatic withdrawal, 
     * withdrawal date, and payment status.
     */
    createAddForm() {
        // Create form and hide by default.
        this.addForm = document.createElement('form')
        this.addForm.setAttribute('hidden', '')

        // Create label for source.
        let sourceLabel = document.createElement('label')
        sourceLabel.innerText = 'Source:'
        this.addForm.appendChild(sourceLabel)
        this.addForm.appendChild(document.createElement('br'))

        // Create input for source.
        let sourceInput = document.createElement('input')
        sourceInput.setAttribute('type', 'text')
        this.addForm.appendChild(sourceInput)
        this.addForm.appendChild(document.createElement('br'))

        // Create label for amount.
        let amountLabel = document.createElement('label')
        amountLabel.innerText = 'Amount:'
        this.addForm.appendChild(amountLabel)
        this.addForm.appendChild(document.createElement('br'))

        // Create number input for amount.
        let amountInput = document.createElement('input')
        amountInput.setAttribute('type', 'number')
        this.addForm.appendChild(amountInput)
        this.addForm.appendChild(document.createElement('br'))

        // Create div for withdrawal date but do not yet add to window.
        // This should be placed after automatic withdrawal input, but 
        // must be declared before automatic withdrawal for hiding logic.
        let withdrawalDateDiv = document.createElement('div')
        withdrawalDateDiv.setAttribute('hidden', '')

        // Create label for automatic withdrawal.
        let automaticLabel = document.createElement('label')
        automaticLabel.innerText = 'Automatic Withdrawal?'
        this.addForm.appendChild(automaticLabel)
        this.addForm.appendChild(document.createElement('br'))

        // Create checkbox input for automatic withdrawal - when checked, show withdrawal date input.
        let automaticInput = document.createElement('input')
        automaticInput.setAttribute('type', 'checkbox')
        automaticInput.addEventListener('click', () => this.toggleAutomaticVisibility(automaticInput, withdrawalDateDiv))
        this.addForm.appendChild(automaticInput)
        this.addForm.appendChild(document.createElement('br'))

        // Add withdrawal date div.
        this.addForm.appendChild(withdrawalDateDiv)

        // Create label for withdrawal day.
        let withdrawalDateLabel = document.createElement('label')
        withdrawalDateLabel.innerText = 'Day of Withdrawal (1-31):'
        withdrawalDateDiv.appendChild(withdrawalDateLabel)

        // Create number input for withdrawal date - 1-31 for days of the month.
        let withdrawalDateInput = document.createElement('input')
        withdrawalDateInput.setAttribute('type', 'number')
        withdrawalDateInput.setAttribute('min', '1')
        withdrawalDateInput.setAttribute('max', '31')
        withdrawalDateDiv.appendChild(withdrawalDateInput)

        // Create submit button and hide it.
        let submitButton = document.createElement('input')
        submitButton.setAttribute('type', 'submit')
        submitButton.setAttribute('hidden', '')
        this.addForm.appendChild(submitButton)

        // When form is submitted, set withdrawal date to 0 if there is no automatic withdrawal
        // then add new expense to list.
        this.addForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let withdrawalDate = withdrawalDateInput.value
            if (!automaticInput.checked)
                withdrawalDate = 0
            this.addFlow({
                'source': sourceInput.value,
                'amount': parseFloat(amountInput.value).toFixed(2),
                'withdrawalDate': withdrawalDate,
                'paidForMonth': false
            })
        })

        this.div.appendChild(this.addForm)
    }

    /**
     * Create and populate display for expenses.
     */
    createExpensesDiv() {
        let expensesDiv = document.createElement('div')
        this.data.forEach((expense => {
            // Create header - h2 whose text is the expense source.
            const header = document.createElement('h2')
            header.innerText = expense.source
            expensesDiv.appendChild(header)

            // Display expense amount.
            const amount = document.createElement('p')
            amount.innerText = expense.amount
            expensesDiv.appendChild(amount)

            // If expense is automatically withdrawn, display withdrawal date.
            if (expense.withdrawalDate > 0) {
                const withdrawalDateText = document.createElement('p')
                withdrawalDateText.innerText = 'Normally withdrawn on the ' + expense.withdrawalDate + ' of every month.'
                expensesDiv.appendChild(withdrawalDateText)
            }
            // If expense is not automatically withdrawn, create checkbox for paid status
            // and logic to save data whenever checkbox state is changed.
            else {
                const paidCheck = document.createElement('div')
                const paidCheckText = document.createElement('p')
                const paidCheckBox = document.createElement('input')
                paidCheck.appendChild(paidCheckText)
                paidCheck.appendChild(paidCheckBox)
                expensesDiv.appendChild(paidCheck)
                paidCheckText.innerText = 'Have you paid this for the month of ' + new Date().toLocaleString('default', { month: 'long' }) + '?'
                paidCheckBox.setAttribute('type', 'checkbox')
                if (expense.paidForMonth)
                    paidCheckBox.checked = true
                paidCheckBox.addEventListener('change', () => this.togglePaid(expense, paidCheckBox))
            }

            // Add delete button.
            this.createDeleteButton(expensesDiv, expense.source)
        }))
        this.div.appendChild(expensesDiv)
    }

    /**
     * Sets value of expense's paidForMonth attribute to match state of 
     * paid checkbox. Since this is called on checkbox state change,
     * this should always toggle the paidForMonth attribute.
     * @param {Object} expense   Expense to be edited.
     * @param {DOM} paidCheckBox Paid checkbox input.
     */
    togglePaid(expense, paidCheckBox) {
        this.data.find((e, i) => {
            if (e.source === expense.source) {
                this.data[i] = {
                    'source': expense.source,
                    'amount': expense.amount,
                    'withdrawalDate': expense.withdrawalDate,
                    'paidForMonth': paidCheckBox.checked
                }
            }
        })
        this.saveData()
    }

    /**
     * Sets visibility of withdrawal input to match state of
     * automatic withdrawal checkbox. Since this is called on checkbox
     * state change, this should always toggle visibility.
     * @param {DOM} automaticInput    Automatic withdrawal checkbox.
     * @param {DOM} withdrawalDateDiv div containing withdrawal date input.
     */
    toggleAutomaticVisibility(automaticInput, withdrawalDateDiv) {
        if (automaticInput.checked)
            withdrawalDateDiv.removeAttribute('hidden')
        else
            withdrawalDateDiv.setAttribute('hidden', '')
    }
}

module.exports = Expense