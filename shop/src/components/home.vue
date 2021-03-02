<template>

    <el-container class="home-container">
        
        <!-- 页面头部区 -->
        <el-header>
            <div>
                <img src="../assets/caiji.png" alt="" width="56px" height="56px">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside  el-aside :width="isCollapse? '64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-col :span="12">
                    <el-menu :router="true" :collapse-transition='false' :collapse='isCollapse' 
                    background-color="#333744" text-color="#fff" active-text-color="#409eff" 
                    :unique-opened="true" :default-active="activePath">
                      <!-- 一级菜单 -->
                      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id" >
                        <!-- 一级菜单里面的模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                          <i :class="iconObjs[item.id]"></i>
                          <!-- 文本 -->
                          <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path " v-for="subItem in item.children" 
                        :key="subItem.id" @click="saveNaveState('/'+subItem.path)"> 
                        <!--  @click="saveNaveState"用于记录点击二级菜单的状态，状态记录下来后可以供后续激活菜单高亮显示使用 -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>    
                        </el-menu-item>
                      </el-submenu>
                    </el-menu>
                </el-col>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    
</template>

<script>

export default {
    data() {
        return {
            menuList: [],
            // 一级菜单的图标用阿里图标库中下载的，且每个菜单对应的图标都不一样
            // 所以将下载的图标与菜单的id选项绑定，放到一个对象中，用以循环对应不同的菜单项
            iconObjs: {
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: '',
        }
    },
    // 在这个页面刚一加载的时候就应该立即获取服务器端的左侧菜单数据
    // 所以在这里要使用生命周期函数

    created(){
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods:{
        logout: function(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        // 获取所有的菜单
        // 当菜单数据获取成功，则需要将其保存到组件的私有数据data中，
        // 而后在进行页面的渲染
        getMenuList: async function(){
           const {data:res} = await this.$http.get('menus');
           if(res.meta.status !==200) return this.$message.console.error(res.meta.msg);
           this.menuList = res.data;
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse: function(){
            this.isCollapse = ! this.isCollapse;
        },
        // 保存二级惨淡对应路由链接的激活状态
        saveNaveState: function(activePa){
            // 将激活状态保存在sessionStorage中，使用的时候从中拿取出来，
            // 赋值给el-menu的default-active属性，来激活对应的二级菜单项
            // 问题是啥时候给default-active动态赋值，应该是整个home组件一旦被创建的时候，就给其赋值
            // 而home组件被创建时会执行created这个生命周期函数，则只要在该生命周期函数中拿取sessionStorage
            // 中的activePath，而后进行动态赋值即可
            window.sessionStorage.setItem('activePath',activePa); 
            this.activePath = activePa;
        },
    }
    
}
</script>

<style lang="less" scoped>
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0px;
        align-items: center;
        color: #fff;
        font-size: 18px;
       > div {
           display: flex;
           align-items: center;
           span {
               margin-left: 15px;
           }
        }
    }
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: 0px;
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    .home-container {
        height: 100%;
    }
    .iconfont {
        margin-right: 10px;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>