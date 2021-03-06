#traffic-info
> 本项目主要通过前端一些比较新的技术重构1年前自己做的一个WebGIS项目：路况信息查询系统。这也是人生做的第一个B/S系统。希望可以通过重构，改善既有代码，梳理应用这一年积累的技术栈。本项目基础开发框架基于Aresn大神的[vue-vueRouter-webpack](https://github.com/icarusion/vue-vueRouter-webpack)，不过在此基础上新增:

* 代码规范工具
* 单元测试工具
* e2e测试工具
* Html模版引擎Jade
* CSS预编译器SCSS

如果您需要此项目的开发框架，可以参考另一个项目[vue-template](https://github.com/tutuxxx/vue-template);

##相关教程
[Webpack使用指南](http://tutuxxx.github.io/2016/08/18/Webpack使用指南/)
[代码规范](http://tutuxxx.github.io/2016/08/14/在Vue+Babel+Webpack环境中使用ESLint/)
[自动化测试](http://tutuxxx.github.io/2016/08/16/是时候学学前端自动化测试了/)

##目录结构
<pre>
│  .gitignore          # 忽略文件,比如 node_modules
│  package.json        # 项目配置
│  README.md           # 项目说明
│  index.html          # 首页
│
├─ webpack.base.config.js         # webpack 基础配置
├─ webpack.dev.config.js          # webpack 开发配置
├─ webpack.prod.config.js         # webpack 生产配置
│
│
├─node_modules
│
├─dist                 # 打包完的文件会自动放在这里
│
└─src
    ├─ main.js         # 启动配置
    │
    ├─components       # 组件
    │       │
    │       └─ app.vue # 入口组件,内含路由和公共部分
    │
    ├─routers          # 路由
    │
    ├─directives       # 自定义指令
    │
    ├─filters          # 自定义过滤器
    │
    ├─config           # 放置一些配置文件
    │
    ├─libs             # 放置一些工具函数
    │
    ├─images           # 放置图片
    │
    ├─styles           # 放置css
    │    │
    │    ├─ common.css # 通用css
    │    │
    │    └─ reset.css  # 页面初始化css
    │
    ├─fonts            # 放置iconfont字体
    │
    │
    └─template         # 放置html模板,webpack依赖此文件生成所需的html
         │
         │
         └─ index.html # 默认的html模板

</pre>

##说明
目前已将css(使用@import的和.vue内style的)样式都独立抽离为main.css文件,如果想按需加载,可以将webpack.base.js内的如下代码注释
```javascript
vue: {
    loaders: {
        css: ExtractTextPlugin.extract(
            "style-loader",
            "css-loader?sourceMap",
            {
                publicPath: "../dist/"
            }
        )
    }
}

new ExtractTextPlugin("[name].css",{ allChunks : true,resolve : ['modules'] }),
```

#如何使用

##说明
> 目前已将打包后的dist目录和webpack生成的index.html和index_prod.html加入了git忽略列表,如果不需要这样做,请修改。
> 目前分开发环境和生产环境,分别对应webpack.dev.config.js和webpack.prod.config.js可以根据自己需要来调整相关webpack配置,比如添加灰度环境配置。
> 目前的开发环境文件使用默认命名,生产环境使用带hash值的命名,可根据自己需要修改,但不建议修改本地环境为带hash的。
> 入口的html文件模板在src/template/index.html内,可自行修改

##安装
```
// 安装前请先确保已安装node和npm
// 需要提前在全局安装webpack和webpack-dev-server,如果已安装请忽略
npm install webpack -g
npm install webpack-dev-server -g

// 安装成功后,再安装依赖
npm install

// 安装selenium及所需浏览器的driver
npm run selenium-setup

```

##运行
####开发环境
```
// 注意首次使用需要执行下面的init命令来生成入口html文件,以后不用再执行
npm run init
npm run dev
```

####生产环境(打包)
```
npm run build
```

####测试
```
//单元测试
npm run unittest

//e2e测试
npm run e2etest
```

####访问
在浏览器地址栏输入http://localhost:8080
