module.exports = {
    // 在这里修改webpack的默认配置

    // 1.用chainWebpack来设置开发和发布模式的不同打包入口
    chainWebpack: config => {
        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
                //entry找到默认的打包入口，调用clear则是删除默认的打包入口
                //add添加新的打包入口
                config.entry('app').clear().add('./src/main-prod.js');
                config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                });
                // 设置标志位，在index.html文件中根据标志位来判断处于哪一种模式
                // 从而实现三方依赖外部CDN资源的按需引入
                // 即发布模式prod使用外部CDN资源；开发模式dev使用npm安装的三方模块通过import之后再使用
                config.plugin('html').tap(args => {
                    args[0].isProd = true
                    return args
                })
            })
            //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }


}