const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const path = require('path')
const url = require('url')

let mainWindow

// Preferences menu
const menu = Menu.buildFromTemplate([{
  label: 'Edit',
  submenu: [
    {
      label: 'Settings',
      click: function (item, focusedWindow) {
        const modalPath = path.join('file://', __dirname, 'preferences.html')
        let win = new BrowserWindow({ width: 300, height: 480 })
        win.on('close', function () { win = null })
        win.loadURL(modalPath)
        win.setMenu(null)
        //win.webContents.openDevTools();
        win.show()
      }
    }
  ]
}]);
Menu.setApplicationMenu(menu)

// Open main window
function createWindow() {
  mainWindow = new BrowserWindow({ width: 640, height: 480 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
