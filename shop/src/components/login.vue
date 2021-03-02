<template>
<!-- 页面结构区域 -->
   <div class="login_container">
         <div class="login_box">
             <!--头像区域  -->
             <div class="avatar_box">
                 <img src="../assets/logo.png" alt="">
             </div>
            <!-- 登录表单区域 -->
            <!-- 该部分需要用到element-ui提供的组件 -->
            <!-- 通过:model="loginForm"将表单数据绑到数据源，具体数据绑到loginForm对象下面的相关属性上 -->
            <!-- 通过定义的属性ref="loginFormRef"拿到该表单的实例对象，从而调用对象resetFields()方法，进行表单数据的重置 -->
            <!-- 具体的重置是将表单数据的重置绑定到重置按钮上 -->
            <!-- 同样的可以通过上述方式拿取对象，调用对象的validate()方法，对表单数据进行提交前的预验证 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username" >
                    <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <!-- 注意进行表单数据的规则验证是绑在表单项中，而不是表单数据输入框中 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click='resetLoginForm'>重置</el-button>
                </el-form-item>                
            </el-form>


         </div>

    </div> 
</template>

<script>
// 行为区域
export default {
    data(){
        return {
            // 这是登录表单的数据绑定对象
            loginForm:{
                // 这是具体的数据绑定的对象的属性
                username: 'admin',
                password: '123456'
            },
            // 这是表单数据的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    // 在失去焦点时触发验证
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                     { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                     { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetLoginForm: function(){
            // 这里的this指向这个登陆组件的实例对象
            // console.log(this)
            this.$refs.loginFormRef.resetFields();
        },
        login: function(){
            // 这个表单实例对象的方法，接收一个回调函数，拿到表单数据预验证的结果
            // 回调函数的第一个形参是一个布尔值，即为我们验证的结果
            this.$refs.loginFormRef.validate(async valid => {
                // console.log(valid);
                // 根据预验证的结果，是否发起登录请求
                if(!valid) return;
                const {data:res} = await this.$http.post("login",this.loginForm);
                console.log(res);
                if(res.meta.status !== 200) return this.$message.error('登陆失败');
                this.$message.success('登陆成功');
                // 1，将登陆成功之后服务器响应给我们的token，保存到客户端的sessionStorage中
                //   1.1项目中除了登陆之外的其他api接口必须在登陆之后才能访问，我们记录token的目的就是
                //      为了在访问这些后续的需要权限的接口时，能提供一个身份认证的信息
                //   1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                window.sessionStorage.setItem("token",res.data.token);
                // 2，通过编程式导航跳转到后台主页，路由地址是/home
                this.$router.push('/home');
            });
        }
    }
}
</script>

<style lang="less" scoped>

    /* 
        lang="less"表示这个节点支持less语法格式
        脚手架初始创建的项目中并没有包含less的有关依赖，为此可以在可视化ui中安装less依赖，
        这样我们就可以使用less语法了，这里要注意一点，就是这个依赖需要安装到开发依赖当中，
        且需要安装less-loader和less两个实现less依赖的包,且这两个依赖包之间要注意版本依赖的问题！！
        scoped是vue的一个指令，用于控制样式的生效区间，加上scoped表示这个样式只在当前这个单文件组件中生效
        如果去掉scoped，则这个样式则会全局生效
    
     */
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width:450px;
        height:300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50% ;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position:absolute;
        left:50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50% ;
            background-color: #eee;

        }
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position:absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>