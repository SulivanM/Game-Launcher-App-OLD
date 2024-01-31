const { app, BrowserWindow, nativeTheme, globalShortcut, session, Tray, Menu } = require('electron');
const path = require('path');
const { Client } = require('discord-rpc');

const clientId = '1104155438938853466';
const rpc = new Client({ transport: 'ipc' });

let mainWindow;
let tray = null;

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

  mainWindow.on('close', function (event) {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  tray = new Tray(path.join(__dirname, 'assets', 'logo.ico'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Launcher', click: () => mainWindow.show() },
    { label: 'Collections', click: () => mainWindow.loadURL('https://launcher.digitalchocolate.online/collections') },
    { label: 'Friends', click: () => mainWindow.loadURL('https://launcher.digitalchocolate.online/friends') },
    { label: 'Settings', click: () => mainWindow.loadURL('https://launcher.digitalchocolate.online/settings') },
    { type: 'separator' },
    { label: 'Exit', click: () => app.quit() }
  ]);

  tray.setToolTip('DC Launcher');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => {
  });

  rpc.login({ clientId }).catch(console.error);

  rpc.on('ready', () => {
    rpc.setActivity({
      details: "DC Launcher",
      state: "In Launcher",
      startTimestamp: new Date(),
      largeImageKey: "https://cdn.digitalchocolate.online/launcher-prod/ressources/launcher-app-discord.png",
      smallImageKey: "https://cdn.digitalchocolate.online/launcher-prod/ressources/launcher-app-discord.png",
      instance: false,
    });
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      if (process.env.BUILD_ENV !== 'development') {
        app.quit();
      }
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', function () {
  app.isQuitting = true;
});
