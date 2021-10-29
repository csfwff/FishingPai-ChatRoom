const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow = null;
//判断命令行脚本的第二参数是否含--debug
const debug = /--debug/.test(process.argv[2]);
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
        height: 300,
        opacity :0.5,
        // frame:false,
        alwaysOnTop:true,
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL("http://localhost:3000/");
    // mainWindow.loadURL("http://pwl.icu/");
    // mainWindow.loadURL(path.join('file://', __dirname, '/build/index.html'));
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