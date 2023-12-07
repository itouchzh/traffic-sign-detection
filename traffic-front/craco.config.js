const path = require('path')
const SpriteLoaderPlugin = require('svg-sprite-loader')

module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            '@': path.resolve(__dirname, 'src'),
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|webp|svg|ico)$/,
                    type: 'asset',
                    // 静态资源处理排除svg icon所在的目录
                    exclude: [path.resolve(__dirname, './src/assets/icons')],
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024,
                        },
                    },
                    generator: {
                        filename: 'image/[name].[hash:8][ext]',
                    },
                },
                {
                    test: /\.svg$/, // 匹配SVG文件
                    include: path.resolve(__dirname, './src/assets/icons'), // 包括的目录
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                symbolId: 'svg-[name]',
                            },
                        },
                    ],
                },
            ],
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
