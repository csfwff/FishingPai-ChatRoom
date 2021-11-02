const { app, BrowserWindow ,session} = require('electron');
const path = require('path');
let mainWindow = null;
//判断命令行脚本的第二参数是否含--debug
const debug = /--debug/.test(process.argv[2]);
const filter = {
    urls: ['https://*.pwl.icu/*']
  }



function makeSingleInstance () {
    if (process.mas) return;
    app.requestSingleInstanceLock();
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}
function createWindow () {
    const windowOptions = {
        width: 400,
        height: 500,
        opacity :0.5,
        // frame:false,
        alwaysOnTop:true,
        webPreferences: {
            javascript: true,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'renderer.js') 
        }
    };
    mainWindow = new BrowserWindow(windowOptions);
    //mainWindow.loadURL("http://localhost:3000/");
    // mainWindow.loadURL("http://pwl.icu/");
    mainWindow.loadURL(path.join('file://', __dirname, '/build/index.html'));
    //接收渲染进程的信息
    const ipc = require('electron').ipcMain;
    ipc.on('min', function () {
        mainWindow.minimize();
    });
    ipc.on('max', function () {
        mainWindow.maximize();
    });
    ipc.on("login",function () {
        mainWindow.maximize();
    });
    ipc.on("token",(e,a)=>{
        session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            details.requestHeaders['Cookie'] = 'sym-ce='+a
            callback({ requestHeaders: details.requestHeaders })
          })

        //   mainWindow.webContents.session.cookies.set({
        //     url: 'https://pwl.icu', 
        //     name: 'sym-ce',
        //     value: a,
        //     domain: '.pwl.icu', 
        //     expirationDate: 99999999999
        //   })
    })

    //如果是--debug 打开开发者工具，窗口最大化，
    if (debug) {
        // mainWindow.webContents.openDevTools();
    }

    mainWindow.on("blur",(e)=>{
      mainWindow.setOpacity(0.5)
    })

    mainWindow.on("focus",()=>{
      mainWindow.setOpacity(1)
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}
makeSingleInstance();
//app主进程的事件和方法
app.on('ready', () => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
module.exports = mainWindow;