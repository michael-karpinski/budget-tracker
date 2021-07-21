const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    // Allows access to both renderer globals and Node.js environment.
    //document.getElementById('add-income-form').addEventListener('submit', () => {})
    ipcRenderer.send('get', 'income')
    ipcRenderer.send('get', 'expenses')
    ipcRenderer.on('incomeReply', (event, arg) => {
        console.log(arg)
    })
    ipcRenderer.on('expensesReply', (event, arg) => {
        console.log(arg)
    })
})

