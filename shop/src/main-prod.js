import Vue from 'vue'
// 导入app根组件
import App from './App.vue'
import router from './router'
// 导入element-ui对应的组件
// ui界面装element-ui插件自动配置的
// 装插件的时候选择按需导入，这样会在src文件夹下自动配置一个plugins文件夹
// 其下面的element.js文件中可以按需导入所需使用的element-ui组件
// 这样就能在自己定义的页面组件中使用element-ui提供的组件了
// 这里将发布模式的element-ui的引入进行删除，在其他文件中通过externals进行配置
// 缩小按需导入的组件的体积，而是直接引入外部的网络上的对应的element-ui资源作为window对象下面全局对象
// 使用到相干组件直接从那个引入的外部资源全局对象中获取即可
// import './plugins/element.js'

// 导入全局样式
import './assets/css/gloabl.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入进度条的三方依赖，并在axios拦截器拦截到请求时使用这个进度条
// 在axios拦截器对请求处理完成后隐藏这个进度条
// 导入进度条三方模块nprogress以及其样式
import Nprogress from 'nprogress'
// 这里将发布模式的样式表进行删除，在其他文件中通过externals进行配置
// 避免项目打包过程中将样式表也合并到一个输出文件中,从而导致项目体积过大
// import 'nprogress/nprogress.css'

// 后台接口调用模块的全局配置
import axios from 'axios'
// 将这个模块包挂载到vue的原型对象上，这样的话每个vue组件
// 都可以通过this直接访问到.$http,从而去发起ajax请求
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 在request拦截其中展示进度条Nprogress.start()
axios.interceptors.request.use(config => {
        //  config.headers即为请求头 
        // console.log(config);
        Nprogress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token');
        // console.log(window.sessionStorage.getItem('token'));
        return config
    })
    // 在response拦截器中隐藏进度条Nprogress.done()
axios.interceptors.response.use(config => {
    Nprogress.done()
    return config
})
Vue.prototype.$http = axios

// 先在vue-ui面板上安装了这个依赖插件，这里将该插件导入项目中
import TreeTable from 'vue-table-with-tree-grid'
// 对导入的别名为TreeTable的插件进行全局注册，以便后续使用
Vue.component('tree-table', TreeTable)

// 新建一个名字为datFormat的全局过滤器用于处理时间，供其他页面组件使用
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    // padStart(2,0);不足两位则前面补零
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, 0);
    const d = (dt.getDate() + '').padStart(2, 0);

    const hh = (dt.getHours() + '').padStart(2, 0);
    const ff = (dt.getMinutes() + '').padStart(2, 0);
    const ss = (dt.getSeconds() + '').padStart(2, 0);

    return `${y}-${m}-${d} ${hh}:${ff}:${ss}`
})

// 导入父文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入父文本编辑器对应的样式
// 这里将发布模式的样式表进行删除，在其他文件中通过externals进行配置
// 避免项目打包过程中将样式表也合并到一个输出文件中,从而导致项目体积过大
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 将父文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)


Vue.config.productionTip = false

// 创建Vue实例，通过render函数，将app根组件渲染到页面上
// 同时还将路由router挂载到了Vue实例对象上面
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')