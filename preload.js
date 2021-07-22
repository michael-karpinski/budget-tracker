const { contextBridge, ipcRenderer } = require('electron')
const Income = require('./income.js')
const Expense = require('./expense.js')

window.addEventListener('DOMContentLoaded', () => {
    let income = new Income(document.getElementById('income-div'))
    let expense = new Expense(document.getElementById('expense-div'))
})