const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    // Allows access to both renderer globals and Node.js environment.
    const addIncomeButton = document.getElementById('add-income-button')
    const addIncomeForm = document.getElementById('add-income-form')
    const newIncomeSource = document.getElementById('new-income-source')
    const newIncomeAmount = document.getElementById('new-income-amount')
    const incomeDiv = document.getElementById('income-div')

    const addExpenseButton = document.getElementById('add-expense-button')
    const addExpenseForm = document.getElementById('add-expense-form')
    const newExpenseSource = document.getElementById('new-expense-source')
    const newExpenseAmount = document.getElementById('new-expense-amount')
    const newExpenseAutomatic = document.getElementById('new-expense-automatic')
    const newExpenseDateVisibility = document.getElementById('new-expense-date-visibility')
    const newExpenseDate = document.getElementById('newExpenseDate')
    const expenseDiv = document.getElementById('expense-div')

    let incomeData
    let expenseData

    // Setup communication for income data.
    ipcRenderer.send('get', 'income')
    ipcRenderer.on('incomeReply', (event, arg) => {
        incomeData = arg
        populateIncome(incomeData, incomeDiv)
    })

    // Setup communication for expense data.
    ipcRenderer.send('get', 'expense')
    ipcRenderer.on('expenseReply', (event, arg) => {
        expenseData = arg
        populateExpenses(expenseData, expenseDiv)
    })

    // When "Add Income" button is clicked, show the add income form.
    addIncomeButton.addEventListener('click', () => {
        addIncomeForm.removeAttribute('hidden')
    })

    // When add income form is submitted, save new income data, reset and hide form, and populate income display.
    addIncomeForm.addEventListener('submit', (e) => {
        e.preventDefault()

        incomeData.push({
            'src': newIncomeSource.value,
            'income': parseFloat(newIncomeAmount.value).toFixed(2)
        })
        saveData('income', incomeData)

        addIncomeForm.setAttribute('hidden', '')
        newIncomeAmount.value = ''
        newIncomeSource.value = ''

        populateIncome(incomeData, incomeDiv)
    })

    // When "Add Expense" button is clicked, show the add expense form.
    addExpenseButton.addEventListener('click', () => {
        addExpenseForm.removeAttribute('hidden')
    })

    // When add expense form is submitted, save new expense data, reset and hide form, and populate expense display.
    addExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault()

        expenseData.push({
            'src': newExpenseSource.value,
            'amount': parseFloat(newExpenseAmount.value).toFixed(2)
        })
        saveData('expense', expenseData)

        addExpenseForm.setAttribute('hidden', '')
        newExpenseAmount.value = ''
        newExpenseSource.value = ''
        newExpenseAutomatic.checked = false
        newExpenseDateVisibility.setAttribute('hidden', '')

        populateExpenses(expenseData, expenseDiv)
    })

    // When "Automatic Withdrawal?" box is toggled on expense form, toggle visibility of withdrawal date.
    newExpenseAutomatic.addEventListener('click', (e) => {
        if (newExpenseAutomatic.checked)
            newExpenseDateVisibility.removeAttribute('hidden')
        else
            newExpenseDateVisibility.setAttribute('hidden', '')
    })
})

function populateIncome(incomeData, incomeDiv) {
    // Populate income display.
    incomeDiv.innerHTML = ''
    incomeData.forEach((incomeSource => {
        const header = document.createElement('h2')
        header.innerText = incomeSource.src
        const amount = document.createElement('p')
        amount.innerText = incomeSource.income
        incomeDiv.appendChild(header)
        incomeDiv.appendChild(amount)
    }))
}

function populateExpenses(expenseData, expenseDiv) {
    // Populate expense display.
    expenseDiv.innerHTML = ''
    expenseData.forEach((expenseSource => {
        const header = document.createElement('h2')
        header.innerText = expenseSource.src
        const amount = document.createElement('p')
        amount.innerText = expenseSource.amount
        expenseDiv.appendChild(header)
        expenseDiv.appendChild(amount)
    }))
}

function saveData(key, value) {
    ipcRenderer.send('set', { 'key': key, 'value': value })
}