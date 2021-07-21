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
    ipcRenderer.send('get', 'expenses')
    ipcRenderer.on('incomeReply', (event, arg) => {
        incomeData = arg
    })
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
            'income': newIncomeAmount.value
        })
        saveData('income', incomeData)
    })
})

function saveData(key, value) {
    ipcRenderer.send('set', { 'key': key, 'value': value })
}