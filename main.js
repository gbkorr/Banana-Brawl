
const {app, BrowserWindow} = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1015,
        height: 645,
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})
