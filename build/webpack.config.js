const webpack = require('webpack')
const path = require('path') 
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const ExtractTextPlugin = require('extract-text-webpack-plugin') 
const project = require('../project.config') 

const inProject = path.join.bind(path, project.basePath)

const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production'

const config = {
    devtool: project.sourcemaps ? 'eval' : false,
    entry: {
        index: [inProject(project.srcDir,'index','index.js')]
    },
    output: {
        path: inProject(project.outDir),
        filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
        publicPath: project.publicPath
    },
    resolve: {
        modules: [
            inProject(project.srcDir),
            'node_modules',
        ],
        extensions: ['*', '.js', '.jsx', '.json'],
    },
    externals: project.externals,
    module: {
        rules: []
    },
    plugins: [
        //setting globals variables
        new webpack.DefinePlugin(Object.assign({
            'process.env': { NODE_ENV: JSON.stringify(project.env) },
            __DEV__,
            __TEST__,
            __PROD__,
        }, project.globals))
    ]
    
}

// JavaScript
// ------------------------------------
config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader'
    }],
})

//styles 
//extract css from bundle
const extractStyles = new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash].css',
    allChunks: true,
    // disable: __DEV__,
})

config.module.rules.push({
    test: /\.(sass|scss|css)$/,
    use: extractStyles.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    modules:true,
                    sourceMap: project.sourcemaps,
                    minimize: {
                        //CSS属性需要对不同的浏览器加上前缀,自动添加
                        autoprefixer: {
                            add: true,
                            remove: true,
                            browsers: ['last 2 versions'],
                        },
                        discardComments: {
                            removeAll: true,
                        },
                        discardUnused: false,
                        mergeIdents: false,
                        reduceIdents: false,
                        safe: true,
                        sourcemap: project.sourcemaps,
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: project.sourcemaps
                }
            }
        ]
    })
})
config.plugins.push(extractStyles)

// Images
// ------------------------------------
config.module.rules.push({
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader',
    options: {
        limit: 8192,
    },
})

// Fonts
// ------------------------------------
const fonts = [
    ['woff', 'application/font-woff'],
    ['woff2', 'application/font-woff2'],
    ['otf', 'font/opentype'],
    ['ttf', 'application/octet-stream'],
    ['eot', 'application/vnd.ms-fontobject'],
    ['svg', 'image/svg+xml'],
]  
fonts.forEach((font) => {
    const extension = font[0]
    const mimetype = font[1]

    config.module.rules.push({
        test: new RegExp(`\\.${extension}$`),
        loader: 'url-loader',
        options: {
            name: 'fonts/[name].[ext]',
            limit: 10000,
            mimetype: mimetype
        },
    })
})

// HTML Template
// ------------------------------------
config.plugins.push(
    new HtmlWebpackPlugin({
        template: inProject(project.srcDir,'index','index.html'),
        inject: true,
        favicon: inProject('public', 'favicon.ico'),
        filename: 'index.html',
        minify: {
            //去掉空格
            collapseWhitespace: true
        }
    })
)

// Development Tools
//Hot reload
// ------------------------------------
if (__DEV__) {
  config.entry.index.unshift(
      'react-hot-loader/patch',
      'webpack-hot-middleware/client'
  )
  config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
  )
}

// Bundle Splitting
//提取公共代码块
// ------------------------------------
if (!__TEST__) {
    //把一些公用的库打包的vendor.js里面，比如像react，react-router，redux等,
    //多加一个manifest.js，使vendor编译的hash值不再变化了。
    const bundles = ['manifest']

  if (project.vendors && project.vendors.length) {
    bundles.unshift('vendor')
    config.entry.vendor = project.vendors
  }
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }))
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
    config.plugins.push(
        //webpack1到webpack2迁移过渡专用，
        //loader选项插件，对于暂时不支持loader的options的属性，使用此插件
        new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        }),
        //js压缩
        new webpack.optimize.UglifyJsPlugin({
        sourceMap: !!config.devtool,
        comments: false,
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        })
  )
}

module.exports = config