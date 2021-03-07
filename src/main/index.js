import { app, BrowserWindow, ipcMain, clipboard } from 'electron';
import { stringify } from 'javascript-stringify';
import logger  from 'electron-log';
const ipc = ipcMain;

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  logger.log('ready !');
  mainWindow = new BrowserWindow({
    height: 800,
    width: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }

  if (isDevelopment) {  
    logger.log('port', process.env.ELECTRON_WEBPACK_WDS_PORT);
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`);
  }

  mainWindow.webContents.on('did-finish-load', () => {
    logger.log('ready to convert');
    convert();
  });
  
  ipc.on('reload', () => {
    convert();
  });
  
  mainWindow.on('closed', () => {
    logger.log('shutdown');
    mainWindow = null;
  });
  
  const copyToClipboard = () => {
    mainWindow.webContents.send('copySelection');
  };

  const convert = () => {
    // when developing toggle comments on next 2 lines
    const clipboardContent = clipboard.readText();
    //const clipboardContent =  '{"Crows":{"players":{"Ben":{"position":"1B"},"Ty":{"position":"2B"}}},"Pigeons":{"players":{"Bill":{"position":"1B"},"Tim":{"position":"2B"}}},"Seagulls":{"players":{"Bob":{"position":"1B"},"Tom":{"position":"2B"}}}}';
    logger.log('convert called');
    try {
      const parsedJson = JSON.parse(clipboardContent);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      mainWindow.webContents.send('formattedJson', parsedJson);
      mainWindow.show();
      clipboard.writeText(prettyJson);
    } catch (error) {
      // not valid json.....don't show anything
      mainWindow.webContents.send('formattedJson', {error: "hmmm, it looks like the clipboard does not\n contain valid json....copy and try again ?"});
    }
  }

  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.focus()
    setImmediate(() => {
      mainWindow.focus()
    })
  });

  return mainWindow;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

ipc.on('convertToJavascriptObject', () => {
  const jsObject = stringify(JSON.parse(clipboard.readText()), null, 2);
  clipboard.writeText(jsObject);
});

ipc.on('find', (event, args) => {
  const id = mainWindow.webContents.findInPage(args.term)
  console.log('id', id)
});
