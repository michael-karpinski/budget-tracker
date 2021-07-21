const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    // Allows access to both renderer globals and Node.js environment.
    const addIncomeButton = document.getElementById('add-income-button')
    const addIncomeForm = document.getElementById('add-income-form')
    const newIncomeSource = document.getElementById('new-income-source')
    const newIncomeAmount = document.getElementById('new-income-amount')

    let incomeData
    let expenseData

    ipcRenderer.send('get', 'income')
    ipcRenderer.on('incomeReply', (event, arg) => {
        incomeData = arg
    })

    ipcRenderer.send('get', 'expenses')
    ipcRenderer.on('expensesReply', (event, arg) => {
        expenseData = arg
    })

    addIncomeButton.addEventListener('click', () => {
        addIncomeForm.removeAttribute('hidden')
    })

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
    })
})

function saveData(key, value) {
    ipcRenderer.send('set', { 'key': key, 'value': value })
}