const path = require("path");
const rootPath = path.join(__dirname,'./');
const srcPath = path.join(rootPath,'src');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');    //抽出css檔案
const HtmlWebpackPlugin = require('html-webpack-plugin');           //自動產生html 靜態檔案對應
const CopyPlugin = require('copy-webpack-plugin');                  //複製目錄
const  WriteFilePlugin = require('write-file-webpack-plugin');      //執行devServer時輸出檔案
const SpritesmithPlugin = require('webpack-spritesmith');           //CSS Sprite

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        main: path.resolve(srcPath, 'index.js'),
    },
    output: {
        filename: '[name].[chunkhash].js',          //filename: '[name].js',
        path: path.resolve(rootPath, 'build')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 4000 }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: { byPassOnDebug: true }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/, // /\.(sass|scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: true
                        }
                    },
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         sourceMap: true
                    //     }
                    // },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //name: '[name].[ext]',
                            limit: 10000,
                            name: '[name].[ext]',
                            mimetype: 'application/font-woff',
                            outputPath: 'fonts',
                            publicPath: '../build/fonts'       // override the default path
                        }
                    }
                ]
            },
			{
				test: /\.(html)$/,
				use: [
					{
						loader: 'html-loader',
						options: {attrs: [':data-src']}
					}
					
				]
			},
        ]   //rules end
    },
    resolve: {
        modules: [
            'node_modules',
            'src/sprite' //css在哪里能找到sprite图
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(srcPath, 'src/sprite'),  //准备合并成sprit的图片存放文件夹
                glob: '**/*.png'
                // glob: '**/*.{jpg,png}'
            },
            target: {
                image: path.resolve(srcPath, 'src/images/sprite.png'),  // sprite图片保存路径
                css: path.resolve(srcPath, 'src/styles/_sprites.scss')  // 生成的sass保存在哪里
            },

            apiOptions: {
                cssImageRef: "../images/sprite.png" //css根据该指引找到sprite图
            }
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyPlugin([
            {
                from:'./src/vender/**/*.gif',
                to: './images/[name].[ext]',
                flatten: true
            },{
                from:'./src/vender/**/*.jpg',
                to: './images/[name].[ext]',
                flatten: true
            },{
                from:'./src/vender/**/*.png',
                to: './images/[name].[ext]',
                flatten: true
            },{
                from:'./src/vender/**/*.cur',
                to: './images/[name].[ext]',
                flatten: true
            },{
                from:'./src/images/*.jpeg',
                to: './images/[name].[ext]',
                flatten: true
            }
        ]),
        new WriteFilePlugin()
    ],
    devServer: {
        open: true,
        contentBase: path.join(__dirname, '.'),
        compress: true,
        port: 9000
    }
};
