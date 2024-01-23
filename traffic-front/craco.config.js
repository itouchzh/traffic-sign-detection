const path = require('path')

module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            '@': path.resolve(__dirname, 'src'),
        },
        module: {
            rules: [],
        },
        plugins: [
            // new SpriteLoaderPlugin({ plainSprite: true }), // 开启svg sprite功能
        ],
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000/api/',
                // target: process.env.REACT_APP_API_BASE_URL,
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            },
        },
    },

   
}
