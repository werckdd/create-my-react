const express = require('express')
const project = require('../project.config')
const socketIO = require('socket.io')
const path = require('path')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)


// ************************************
// This is the webpack-hot-middleware
// ************************************
if (project.env === 'development') {
    const webpack = require('webpack')
    const webpackConfig = require(path.join(project.basePath,'build','webpack.config.js'))
    const compiler = webpack(webpackConfig)
    console.log(compiler.outputPath)
    console.log(compiler.outputFileSystem)

    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: path.resolve(project.basePath, project.srcDir),
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        stats: 'normal',
    }))
    app.use(require('webpack-hot-middleware')(compiler))

    // 设置静态资源路径，浏览器会默认请求该路径下favicon.ico
    app.use(express.static(path.resolve(project.basePath, 'public')))

    // 重定向到index.html
    app.use('*', function (req, res, next) {
        const filename = path.join(compiler.outputPath, 'index.html')
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
                return next(err)
            }
            res.set('content-type', 'text/html')
            res.send(result)
            res.end()
        })
    })

    io.on('connection', function (socket) {
        socket.on('disconnect', function () { })
    })

} else {
    logger.warn(
        'Server is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application server for this and can instead use a web ' +
        'server such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
    )

    app.use(express.static(path.resolve(project.basePath, project.outDir)))
}


module.exports = server