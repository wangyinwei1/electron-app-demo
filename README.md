## 可用脚本

### `npm run start`
以开发模式运行应用程序
在浏览器中打开[http://localhost:3000](http://localhost:3000)查看。

### `npm run build`
生产环境构建

### `npm run electron:start`
electron开发环境运行

### `npm run electron:build`
electron生产打包



 
 ### 打包遇到的问题
 1. electron-builder打包失败Application entry file “build/electron.js“
	- https://blog.csdn.net/weixin_42826294/article/details/113592301

 2. 打包构建需要自定义网络协议或者关闭严格网络模式(但是不建议关闭严格网络模式),所以选择自定义网络协议

	```  自定义协议代码 参考vue-cli-plugin-electron-builder
		
	
	onst { protocol } = require("electron")
	const path = require("path")
	const { readFile } = require("fs")
	const { URL } = require("url")

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
	```

参考: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#loading-local-images-resources