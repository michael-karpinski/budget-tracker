const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('./store.js')

const store = new Store({
    configName: 'user-data'
})

/**
 * Create main application window.
 */
function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true
        }
    })

    win.loadFile('src/index.html')
    return win
}

app.whenReady().then(() => {
    const window = createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })

    // When a get request is received, respond with title and associated data.
    // Example response: 'incomeReply', [{INCOME SOURCE}, {INCOME SOURCE}, . . .]
    ipcMain.on('get', (event, args) => {
        event.sender.send(args + 'Reply', store.get(args))
    })

    // When a set request is received, save the data to store; then respond with title and associated data.
    ipcMain.on('set', (event, args) => {
        store.set(args.key, args.value)
        event.sender.send(args.key + 'Reply', store.get(args.key))
    })
})