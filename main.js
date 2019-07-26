const electron = require('electron');
// Module to control application life. (this variable should already exist)
const app = electron.app;

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipcRenderer = require('electron').ipcRenderer
const ipcMain = require('electron').ipcMain
const tmp = require('tmp')
const fs = require('fs')
const ps = require('ps-node');
const { exec, spawn } = require('child_process');

var pids = [];

ipcMain.on('add-pid-msg', function(event, arg) {
  pids.push(arg);
});

ipcMain.on('rem-pid-msg', function(event, arg) {
  pids.splice(pids.indexOf(arg), 1);
});

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 600, height: 860, icon: path.join(__dirname, './assets/icons/logo.ico')})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', ()=> {
    mainWindow = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    pids.forEach(function(pid) {
        // A simple pid lookup
        ps.kill( pid, function( err ) {
            if (err) {
                throw new Error( err );
            }
            else {
                console.log( 'Process %s has been killed!', pid );
            }
        });
      });
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};
