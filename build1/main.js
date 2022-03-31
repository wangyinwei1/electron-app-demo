// 引入electron并创建一个Browserwindow
const { app, protocol, BrowserWindow } = require("electron")
const path = require("path")
const url = require("url")
const { readFile } = require("fs")
const { URL } = require("url")

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
])
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow
function createWindow() {
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    // webPreferences: {
    //   // 适用于electron 11
    //   // javascript: true,
    //   // plugins: true,
    //   nodeIntegration: true, // 是否集成 Nodejs
    //   // enableRemoteModule: true,
    //   // webSecurity: false,
    //   // contextIsolation: false,
    // },
    // backgroundColor: "#efefef",
  })

  // 加载应用----适用于 react 项目
  //生产环境
  createProtocol("app")
  mainWindow.loadURL("app://./index.html")
  //开发环境
  // mainWindow.loadURL("http://localhost:3001")

  // 打开开发者工具，默认不打开
  // mainWindow.webContents.openDevTools()
  // 关闭window时触发下列事件.
  mainWindow.on("closed", function () {
    mainWindow = null
  })
}
// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on("ready", createWindow)
// 所有窗口关闭时退出应用.
app.on("window-all-closed", function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== "darwin") {
    app.quit()
  }
})
app.on("activate", function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow()
  }
})

const createProtocol = (scheme, customProtocol) => {
  const l = customProtocol || protocol
  l.registerBufferProtocol(scheme, (request, respond) => {
    let pathName = new URL(request.url).pathname
    console.log(pathName)
    pathName = decodeURI(pathName) // Needed in case URL contains spaces
    console.log(pathName)

    readFile(path.join(__dirname, pathName), (error, data) => {
      if (error) {
        console.error(`Failed to read ${pathName} on ${scheme} protocol`, error)
      }
      const extension = path.extname(pathName).toLowerCase()
      let mimeType = ""

      if (extension === ".js") {
        mimeType = "text/javascript"
      } else if (extension === ".html") {
        mimeType = "text/html"
      } else if (extension === ".css") {
        mimeType = "text/css"
      } else if (extension === ".svg" || extension === ".svgz") {
        mimeType = "image/svg+xml"
      } else if (extension === ".json") {
        mimeType = "application/json"
      } else if (extension === ".wasm") {
        mimeType = "application/wasm"
      }

      respond({ mimeType, data })
    })
  })
}
