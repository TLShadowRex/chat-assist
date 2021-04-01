// src/electron.js
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { config } = require('process');


function createWindow() {
  let config = {
    'width': 1024,
    'height': 768,
    'tmiToken': null,
    'pubSubToken': null,
    'userName': null,
    'channel': null,
    'filters': [],
    'blackList': []
  }

  if (fs.existsSync(path.join(app.getPath('userData'), "config.json"))) {
    config = Object.assign(config, JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), "config.json")).toString()));
  }
  fs.writeFileSync(path.join(app.getPath('userData'), "config.json"), JSON.stringify(config));

  // Create the browser window.
  let win = new BrowserWindow({
    width: config.width,
    height: config.height,
    webPreferences: {
      nodeIntegration: true,
      devTools:false
    }
  });
  win.on('resize',(event) => {
    var size   = win.getSize();
    var width  = size[0];
    var height = size[1];
    updateConfig({'width':width,'height':height});
  })
  win.setApplicationMenu(null)

  // and load the index.html of the app.
  win.loadFile(__dirname + '/dist/index.html');
  ipcMain.on('user.getConfig', () => {
    win.webContents.send('user.config', config);
  })
  ipcMain.on('user.setConfig',(event,changes) => {
    updateConfig(changes);
    win.webContents.send('user.config', config);
  })

  win.webContents.openDevTools();

  function updateConfig(changes) {
    let local = Object.assign(config,changes);
    fs.writeFileSync(path.join(app.getPath('userData'), "config.json"), JSON.stringify(local));
    return local;
  }
}

app.on('ready', createWindow);
