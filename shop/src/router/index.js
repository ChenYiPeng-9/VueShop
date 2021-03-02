import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../components/login.vue'
const login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
    // import home from '../components/home.vue'
const home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
    // import welcome from '../components/welcome.vue'
const welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import users from '../components/user/users.vue'
const users = () =>
    import ( /* webpackChunkName: "users_rights_roles" */ '../components/user/users.vue')
    // import rights from '../components/power/rights.vue'
const rights = () =>
    import ( /* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue')
    // import roles from '../components/power/roles.vue'
const roles = () =>
    import ( /* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue')

// import categories from '../components/goods/categories.vue'
const categories = () =>
    import ( /* webpackChunkName: "categories_params" */ '../components/goods/categories.vue')
    // import params from '../components/goods/params.vue'
const params = () =>
    import ( /* webpackChunkName: "categories_params" */ '../components/goods/params.vue')

// import list from '../components/goods/list.vue'
const list = () =>
    import ( /* webpackChunkName: "list_addGoods" */ '../components/goods/list.vue')
    // import addGoods from '../components/goods/addGoods.vue'
const addGoods = () =>
    import ( /* webpackChunkName: "list_addGoods" */ '../components/goods/addGoods.vue')

// import order from '../components/order/order.vue'
const order = () =>
    import ( /* webpackChunkName: "order_report" */ '../components/order/order.vue')
    // import report from '../components/report/report.vue'
const report = () =>
    import ( /* webpackChunkName: "order_report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
        path: '/home',
        component: home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: welcome },
            { path: '/users', component: users },
            { path: '/rights', component: rights },
            { path: '/roles', component: roles },
            { path: '/categories', component: categories },
            { path: '/params', component: params },
            { path: '/goods', component: list },
            { path: '/goods/add', component: addGoods },
            { path: '/orders', component: order },
            { path: '/reports', component: report },
        ]
    },

]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from代表从那个路径跳转而来
    // next是一个函数，表示放行
    // next()放行  next('/login')强制跳转
    if (to.path == '/login') return next();
    // 获取token,根据token情况来判断用户是否处于登录状态
    // 如果token值为空，即用户没有登录，则强制其跳转到登录页面
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    // token值存在，用户登录直接放行
    next();

})

export default router