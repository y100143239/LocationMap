# 1. 起步

1. 安装

    安装：npm install --save-dev webpack
    说明：安装到 node_modules 目录下
    
    
2. package.json

    安装：npm init -y
    说明：直接生成
    
3. lodash

    安装：npm install --save lodash
    引入：import _ from 'lodash';
    说明：该库会直接合并到 bundle.js
    
4. 命令行打包

    命令：./node_modules/.bin/webpack src/index.js dist/bundle.js
    
5. 执行配置文件打包

    命令：./node_modules/.bin/webpack --config webpack.config.js
    
    配置：
    
        /* package.json */
        
        "scripts": {
            "build": "./node_modules/.bin/webpack --config webpack.config.js"
        }
        
        // 执行
        $ npm run build
    
    
# 2. 管理资源

1. 加载 CSS

    安装：sudo npm install --save-dev style-loader css-loader
    
    使用：import './style.css';
    
    配置：
    
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        // "style-loader",
                        "css-loader"
                    ]
                },
                ...
            ]
            ...
        }
        
    说明：将CSS文件内容插入页面样式标签。 
   
2. 加载图片

    安装：sudo npm install --save-dev file-loader
    
    配置：
    
        module: {
            rules: [
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        "file-loader"
                    ]
                },
                ...
            ]
            ...
        }

    说明：处理“import”的css文件，图片会自动重命名后移动到 dist 目录
    
3. 加载字体

   类似加载图片
   
4. 加载数据 

   默认支持 ".json" 后缀的 import 
   
# 3. 管理输出

1. 设定 HtmlWebpackPlugin

   安装：sudo npm install --save-dev html-webpack-plugin
   
   说明：生成新的 dist/index.html 文件
   
2. 清理 /dist 文件夹

   安装：sudo npm install clean-webpack-plugin --save-dev
   
   说明：清理
    
# 4. 开发

1. 使用 source map

   说明：追踪到错误和警告在源代码中的原始位置
   
2. 使用观察模式

   使用：webpack --watch
    
3. webpack-dev-server
   
   安装：sudo npm install --save-dev webpack-dev-server
   说明：一个简单 web 服务器，实时刷新（live reloading）
   
# 5. 模块热替换

它允许在运行时更新各种模块，而无需进行完全刷新。

# 6. Tree Shaking

1. 精简输出

   安装：sudo npm i --save-dev uglifyjs-webpack-plugin

# 7. 生产环境构建

1. 配置

   安装：sudo npm install --save-dev webpack-merge
   
