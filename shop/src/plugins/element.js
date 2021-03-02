import Vue from 'vue'
// 按需导入组件
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 弹框提示组件的导入
// import { Message } from 'element-ui'

import { Upload, Checkbox, CheckboxGroup, Step, Steps, TabPane, Tabs, Alert, Cascader, Option, Select, Tree, Tag, MessageBox, Dialog, Pagination, Tooltip, Switch, TableColumn, Table, Col, Row, Card, BreadcrumbItem, Breadcrumb, Menu, Submenu, MenuItem, MenuItemGroup, Container, Header, Aside, Main, Button, Form, FormItem, Input, Message } from 'element-ui'

// 导入当前项目版本所不支持的时间线组件
import Timeline from './timeline/index'
import TimelineItem from './timeline-item/index'
// 将导入的时间线组件注册为全局可用的组件
Vue.use(Timeline)
Vue.use(TimelineItem)


// 将导入的组件配置为全局可用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)


Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
    // 使用弹窗组件和前面几个组件存在不同，
    // 他需要挂载到Vue的原型对象上
    // 这样每个组件的this.$message就可以使用该弹窗组件了