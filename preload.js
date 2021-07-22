const { contextBridge, ipcRenderer } = require('electron')
const Income = require('./income.js')

window.addEventListener('DOMContentLoaded', () => {
    // Allows access to both renderer globals and Node.js environment.

    const addExpenseButton = document.getElementById('add-expense-button')
    const addExpenseForm = document.getElementById('add-expense-form')
    const newExpenseSource = document.getElementById('new-expense-source')
    const newExpenseAmount = document.getElementById('new-expense-amount')
    const newExpenseAutomatic = document.getElementById('new-expense-automatic')
    const newExpenseDateVisibility = document.getElementById('new-expense-date-visibility')
    const newExpenseDate = document.getElementById('new-expense-date')
    const expenseDiv = document.getElementById('expense-div')

    let expenseData

    let income = new Income(document.getElementById('income-div'))

    // Setup communication for expense data.
    ipcRenderer.send('get', 'expense')
    ipcRenderer.on('expenseReply', (event, arg) => {
        expenseData = arg
        populateExpense(expenseData, expenseDiv)
    })

    ipcRenderer.on('expenseSaved', (event, arg) => {
        populateExpense(expenseData, expenseDiv)
    })

    // When "Add Expense" button is clicked, show the add expense form.
    addExpenseButton.addEventListener('click', () => {
        addExpenseForm.removeAttribute('hidden')
    })

    // When add expense form is submitted, save new expense data, reset and hide form, and populate expense display.
    addExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let withdrawalDate = 0
        if (newExpenseAutomatic.checked)
            withdrawalDate = parseInt(newExpenseDate.value)
        expenseData.push({
            'src': newExpenseSource.value,
            'amount': parseFloat(newExpenseAmount.value).toFixed(2),
            'withdrawalDate': withdrawalDate,
            'paidForMonth': false
        })
        saveData('expense', expenseData)

        addExpenseForm.setAttribute('hidden', '')
        newExpenseAmount.value = ''
        newExpenseSource.value = ''
        newExpenseAutomatic.checked = false
        newExpenseDateVisibility.setAttribute('hidden', '')

        populateExpense(expenseData, expenseDiv)
    })

    // When "Automatic Withdrawal?" box is toggled on expense form, toggle visibility of withdrawal date.
    newExpenseAutomatic.addEventListener('click', (e) => {
        if (newExpenseAutomatic.checked)
            newExpenseDateVisibility.removeAttribute('hidden')
        else
            newExpenseDateVisibility.setAttribute('hidden', '')
    })
})

function populateExpense(expenseData, expenseDiv) {
    // Populate expense display.
    expenseDiv.innerHTML = ''
    expenseData.forEach((expenseSource => {
        const header = document.createElement('h2')
        header.innerText = expenseSource.src
        const amount = document.createElement('p')
        amount.innerText = expenseSource.amount
        expenseDiv.appendChild(header)
        expenseDiv.appendChild(amount)
        if (expenseSource.withdrawalDate > 0) {
            const withdrawalDateText = document.createElement('p')
            withdrawalDateText.innerText = 'Normally withdrawn on the ' + expenseSource.withdrawalDate + ' of every month.'
            expenseDiv.appendChild(withdrawalDateText)
        }
        else {
            const paidCheck = document.createElement('div')
            const paidCheckText = document.createElement('p')
            const paidCheckBox = document.createElement('input')
            paidCheck.appendChild(paidCheckText)
            paidCheck.appendChild(paidCheckBox)
            expenseDiv.appendChild(paidCheck)
            paidCheckText.innerText = 'Have you paid this for the month of ' + new Date().toLocaleString('default', { month: 'long' }) + '?'
            paidCheckBox.setAttribute('type', 'checkbox')
            console.log(expenseSource.paidForMonth)
            if (expenseSource.paidForMonth)
                paidCheckBox.checked = true
            paidCheckBox.addEventListener('change', () => togglePaid(expenseData, expenseSource, paidCheckBox))
        }
    }))

    function togglePaid(expenseData, expenseSource, paidCheckBox) {
        expenseData.find((expense, i) => {
            if (expense.src === expenseSource.src) {
                expenseData[i] = {
                    'src': expenseSource.src,
                    'amount': expenseSource.amount,
                    'withdrawalDate': expenseSource.withdrawalDate,
                    'paidForMonth': paidCheckBox.checked
                }
            }
        })
        console.log(expenseData)
        saveData('expense', expenseData)
    }
}

function saveData(key, value) {
    ipcRenderer.send('set', { 'key': key, 'value': value })
}