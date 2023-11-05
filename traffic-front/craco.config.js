const path = require('path')

module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            '@': path.resolve(__dirname, 'src'),
        },
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

    // babel: {
    //     presets: [
    //         [
    //             '@babel/preset-react',
    //             {
    //                 runtime: 'automatic',
    //                 importSource: '@emotion/react',
    //             },
    //         ],
    //     ],
    //     plugins: ['@emotion'],
    // },
}
