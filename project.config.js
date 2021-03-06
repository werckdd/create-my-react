// Global Variable

const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000

module.exports = {
    /** 运行环境 */
    env: NODE_ENV,
    /** 端口 */
    port:PORT,
    /** 根路径全名 */
    basePath: __dirname,
    /** 源文件目录 */
    srcDir: 'src',
    /** 打包输出路径 */
    outDir: 'dist',
    /** 公共路径 */
    publicPath: '/',
    /** 是否sourcemap */
    sourcemaps: true,
    /** A hash map of keys that the compiler should treat as external to the project */
    externals: {},
    /** A hash map of variables and their values to expose globally */
    globals: {},
    /** Whether to enable verbose logging */
    verbose: false,
    /** The list of modules to bundle separately from the core application code */
    vendors: [
        'react',
        'react-dom',
        'redux',
        'react-redux',
        'redux-thunk',
        'react-router'
    ]
}