const { contextBridge, ipcRenderer } = require('electron')
const Income = require('./income.js')
const Expense = require('./expense.js')

window.addEventListener('DOMContentLoaded', () => {
    new Income(document.getElementById('income-div'))
    new Expense(document.getElementById('expense-div'))
})