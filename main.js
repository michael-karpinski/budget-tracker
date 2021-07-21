const { app, BrowserWindow } = require('electron')
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

    window.on('resize', () => {
        let { width, height } = window.getBounds()
        store.set('windowBounds', { width, height })
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})