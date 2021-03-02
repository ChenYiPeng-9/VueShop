<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- element-ui的栅格布局：layout组件，其中el-row表示行，el-col表示列
            每一行24，可以通过span来设置每一列的宽度，通过gutter设置列与列之间的间隔
             -->
             <!-- 搜索与添加区域 -->
            <el-row :gutter="30">
                <el-col :span="10">
                    <!--clearable用于指定可清空文本输入框  -->
                    <!--@clear="getUserList"，当文本输入框中的内容被清空以后立即触发其后绑定的事件  -->
                    <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query">
                      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4"> 
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" border  stripe style="width: 100%">
                <el-table-column type="index"> </el-table-column>
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
                <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
                <el-table-column label="状态" width="180" >
                    <!-- 状态列通过作用域插槽接收scope，就可以通过scope.row属性来获取这一行所对应的数据，进而从数据中获取状态的值-->
                    <template slot-scope="scope">
                        <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="180">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <!-- 鼠标放到该组件上会有对应的提示信息 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" circle size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"  :page-sizes="[2, 3, 4, 5]" 
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            <!--:page-sizes动态属性用于可展示页面的选择设置  -->
            <!--:page-size动态属性用于设置当前页展示多少条数据  -->
            <!--layout的作用是用来指定页面上所需展示的功能组件  -->
            <!--:total告知总共有多少条数据  -->
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
            <!--title属性用于设置对话框的标题，:visible.sync属性用于设置对话框是否展示，
            在data数据中要定义该属性对应的属性值变量-->
            <!-- 对话框的内容主体区 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                <!--:model="addForm"添加用户绑定的数据，:rules="rules"用户数据验证的规则 ，
                表单中prop="name"指定某一项的验证规则
                ref="ruleForm"给添加用户表单起的一个引用名称 -->
                <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框的底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
            <div>
                <p>当前的用户:{{userInfo.username}}</p>
                <p>当前的角色:{{userInfo.role_name}}</p>
                <!-- 分配角色的下拉列表 -->
                <p>
                    分配新角色:
                     <el-select v-model="selectedRoleId" placeholder="请选择">
                         <!-- 选中的是:label="item.roleName"真正记录到v-model="selectedRoleId"中的是:value="item.id" -->
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRoleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    created(){
        this.getUserList();
    },
    data(){
            // 自定义验证邮箱的规则
            let checkEmail = (rule, value, cb) => {
              // 验证邮箱的正则表达式
              const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
              if (regEmail.test(value)) {
                // 合法的邮箱
                return cb();
              }
              cb(new Error('请输入合法的邮箱'));
            }
            // 自定义验证手机号的规则
           let checkMobile = (rule, value, cb) => {
             // 验证手机号的正则表达式
             const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
             if (regMobile.test(value)) {
               return cb();
             }
             cb(new Error('请输入合法的手机号'));
           }
        return{
            queryInfo:{
                // query查询关键字
                query:'',
                // 当前的页数,可以传递给el-pagination组件的:current-page动态属性
                pagenum:1,
                // 当前每页显示多少条数据,可以传递给el-pagination组件的:page-size动态属性
                pagesize:2
            },
            userList: [],
            // 数据库中总共有多少条数据,可以传递给el-pagination组件的:total动态属性
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            dialogVisible: false,
            // 添加用户表单数据的对象,表单中填写的数据都会自动同步到这个对象中
            addForm: {
                username:'',
                password:'',
                email:'',
                mobile:'',
            },
            // 添加用户表单数据验证规则的对象
            addFormrules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }                    
                ],
                email:[
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },          
                    // 通过validator:checkEmail属性将自定义验证规则添加到验证规则中
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入用户手机号', trigger: 'blur' },
                    // 通过validator:checkEmail属性将自定义验证规则添加到验证规则中
                    {validator:checkMobile,trigger:'blur'}
                ],
                
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            // 存放用户修改，根据id查询到的用户数据
            editForm : {},
            // 存放用户修改，根据id查询到的用户数据的验证规则
            editFormRules:{
                email:[
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },          
                    // 通过validator:checkEmail属性将自定义验证规则添加到验证规则中
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入用户手机号', trigger: 'blur' },
                    // 通过validator:checkEmail属性将自定义验证规则添加到验证规则中
                    {validator:checkMobile,trigger:'blur'}
                ],
            },
            // 控制分配角色对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 需要被分配角色的用户信息
            userInfo:{},
            // 所有角色的数据列表
            rolesList:[],
            // 已选中的角色id值
            selectedRoleId:[],
        }
    },
    methods:{
        // 按指定的设置从数据库中查询数据，查询的数据通过el-table组件展示在页面上
        getUserList:async function(){
            const {data:res} = await this.$http.get('users',{params:this.queryInfo});
            if(res.meta.status !== 200 ) return this.$message.console.error('获取用户列表失败！');
            this.userList = res.data.users;
            this.total = res.data.total;
            // console.log(res);
        },
        // 监听pagesize改变的事件(即下拉框选择展示多少页)
        handleSizeChange: function(newSize){
            this.queryInfo.pagesize = newSize;
            // 设置改变需要重新查询数据
            this.getUserList();
            // console.log(newSize);
        },
        // 监听页码值 改变的事件
        handleCurrentChange: function(newPage){
            this.queryInfo.pagenum = newPage;
            // 设置改变需要重新查询数据
            this.getUserList();
            // console.log(newPage);
        },
        // 监听switch开关状态的改变
        userStateChanged:async function(userInfo){
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            // console.log(11111,userInfo);
            if(res.meta.status!==200) {
                // 数据库中的状态数据修改失败，但是我页面上显示的是修改后的，
                // 所以页面上的修改也要让他变为没有修改的样子
                userInfo.mg_state = !userInfo.mg_state;
                return this.$message.error('更新用户状态失败！');
            }
            this.$message.success('更新用户状态成功！');
        },
        // 监听添加用户对话框的关闭事件，该事件被触发时清空所有表单中的输入内容
        addDialogClosed: function(){
            // 通过表单的引用对象来获取表单对象，在调用表单对象的重置方法
            // 即可实现表单的重置
            this.$refs.addFormRef.resetFields();
        },
        // 对话框中表单数据的预校验
        addUser: function(){
            // 表单预校验也需要获取表单对象
            this.$refs.addFormRef.validate(
                async (valid)=>{
                    console.log(valid);
                    if(!valid) return;
                    // 可以发起添加用户的网络请求
                    const {data:res} = await this.$http.post('users',this.addForm);
                    if(res.meta.status!==201){
                        this.$message.error('添加用户失败');
                    }
                    this.$message.success('添加用户成功');
                    // 用户添加成功后关闭对话框
                    this.dialogVisible = false;
                    // 对话框关闭后，需从服务器端查询数据，并显示到页面上
                    this.getUserList();
                });
        },
        // 展示编辑用户的对话框
        showEditDialog: async function(id){
            // console.log(id);
            const{data:res} = await this.$http.get('users/' + id);
            if(res.meta.status !==200){
                return this.$message.error('查询用户失败');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听修改用户对话框的关闭事件，该事件被触发时清空所有表单中的输入内容
        editDialogClosed: function(){
            this.$refs.editFormRef.resetFields();
        },
        // 修改用户信息并提交
        editUserInfo: function(){
            this.$refs.editFormRef.validate(async val =>{
                console.log(val);
                if(!val) return;
                //发起修改用户数据信息的请求
                const {data:res} = await this.$http.put('users/'+ this.editForm.id,{
                    id:this.editForm.id,
                    email:this.editForm.email,
                    mobile:this.editForm.mobile,
                })
                // 更新数据失败
                if(res.meta.status !==200){
                    return this.$message.error('更新用户信息失败');
                }
                // 更新数据成功
                this.editDialogVisible=false;
                this.getUserList();
                this.$message.success('更新用户信息成功');
            })
        },
        // 根据用户id删除对应的用户数据信息
        removeUserById: async function(id){
            console.log(id);
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            // catch(err=>err)捕获弹出确认提示框过程中可能出现的错误
            // 如果用户确认删除，则返回值为字符串confirm
            // 如果用户取消了删除，则返回值为字符串cancel
            // console.log(confirmResult);
            if(confirmResult!=='confirm'){
                return this.$message.info('已取消删除');
            }
            // console.log('确认了删除');
            const {data:res} = await this.$http.delete('users/' + id);
            if(res.meta.status !==200) return this.$message.error('用户删除失败');

            this.$message.success('用户删除成功');
            this.getUserList();
            

        },
        // 展示分配角色对话框的相关事件处理函数
        setRole: async function(userInfo){
            // 获取到每一行用户的信息存储到vue变量userInfo中
            this.userInfo = userInfo;
            // 在展示对话框之前需要获取所有的角色列表
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status!==200) return this.$message.error('角色获取失败');
            // 角色列表获取成功将其存入rolesList 这个vue数组变量中供后续使用
            this.rolesList = res.data;
            this.setRoleDialogVisible=true;
        },
        // 将角色分配中的下拉列表中选中的角色通过对话框中
        // 的确定按钮的事件处理函数渲染到页面上
        saveRoleInfo: async function(){
            if(!this.selectedRoleId) return this.$message.error('请选择所需分配的角色');
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
                rid: this.selectedRoleId,
            });
            if(res.meta.status!==200) return this.$message.error('用户分配角色失败');

            this.$message.success('用户分配角色成功');
            this.getUserList();
            this.setRoleDialogVisible=false;
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed: function(){
            this.selectedRoleId = '';
            this.userInfo = {};
        },
    },

}
</script>
<style lang="less" scoped>

</style>