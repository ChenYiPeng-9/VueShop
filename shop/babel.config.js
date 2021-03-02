// 这是项目发布阶段需要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}


module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 直接向下面这样配置移除console，会有一个问题，本配置文件在开发阶段，和发布阶段都会被编译
        // 所以也就是说,这会使得两个阶段的console都会被移除,而我们开发阶段是需要用console来查看效果的
        // 所以需要修改配置,使得只有在项目发布阶段才需要移除console
        // 如何区分项目处在开发阶段还是发布阶段呢，查看serve，和build输出面板发现--model的值分别为production和development
        // 即开发阶段的model值是production发布阶段是development 
        // 'transform-remove-console'
        ...prodPlugins,
        // 安装完实现路由懒加载的三方依赖后，这里进行配置
        // 接下来就是在路由文件中去修改路由代码实现路由懒加载功能
        "@babel/plugin-syntax-dynamic-import"

    ]
}