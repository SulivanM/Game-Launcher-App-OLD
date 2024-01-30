const { app, BrowserWindow, nativeTheme, globalShortcut, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  session.defaultSession.clearCache();

  nativeTheme.themeSource = 'dark';

  mainWindow = new BrowserWindow({
    width: 1330,
    height: 730,
    icon: "assets/logo.ico",
    webPreferences: {
      nodeIntegration: false,
    }
  });

  mainWindow.loadURL('https://launcher.digitalchocolate.online/home');
  mainWindow.setTitle('DC Launcher');

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => {
  });

  // Gestion processus de construction
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      if (process.env.BUILD_ENV !== 'development') {
        app.quit();
      }
    }
  });
});