const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('./store.js')

const store = new Store({
    configName: 'user-data',
    defaults: {
        windowBounds: { width: 800, height: 600 }
    }
})

function createWindow() {
    let { width, height } = store.get('windowBounds')
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('front_end/index.html')
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

    window.on('resize', () => {
        let { width, height } = window.getBounds()
        store.set('windowBounds', { width, height })
    })

    ipcMain.on('get', (event, args) => {
        event.sender.send(args + 'Reply', store.get(args))
    })

    ipcMain.on('set', (event, args) => {
        console.log('Setting data . . .')
    })
})