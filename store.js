const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
    // Credit: Cameron Nokes at https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(userDataPath, opts.configName + '.json')
        this.data = parseDataFile(this.path, opts.defaults)
        if (this.get('income') == undefined)
            this.set('income', {})
        if (this.get('expenses') == undefined)
            this.set('expenses', {})
    }

    get(key) {
        return this.data[key]
    }

    set(key, val) {
        this.data[key] = val
        fs.writeFileSync(this.path, JSON.stringify(this.data))
        console.log(this.data)
    }
}

function parseDataFile(filePath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filePath))
    } catch (error) {
        return defaults
    }
}

module.exports = Store