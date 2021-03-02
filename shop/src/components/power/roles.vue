<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                     <template slot-scope="scope">
                         <!-- 栅格布局，一行24个列 -->
                         <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['vcenter','bdbottom',i1 ===0? 'bdtop':'bdbottom']">
                             <!-- 渲染一级权限，使用5列 -->
                            <el-col :span="5" >
                                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <!-- 权限后面的图标 -->
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限，使用19列 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <!-- :class给标签项加边框线 -->
                                 <el-row :class="[i2 === 0? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                     <!-- 渲染二级权限 -->
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                        <!-- 权限后面的图标 -->
                                        <i class="el-icon-caret-right"></i>   
                                    </el-col>
                                    <!-- 渲染三级权限 -->
                                    <el-col :span="18" >
                                        <!-- closable给标签添加可删除小叉号，通过点击标签的小叉号，
                                        触发标签的关闭事件，并通过关闭事件的时间处理函数删除标签 -->
                                        <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warnning" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                 </el-row>
                            </el-col>
                         </el-row>
                         <!-- <pre>
                             {{scope.row}}
                         </pre> -->
                     </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"  @click="removeRoleById(scope.row.id)" >删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                <!--:model="addForm"添加用户绑定的数据，:rules="rules"用户数据验证的规则 ，
                表单中prop="name"指定某一项的验证规则
                ref="ruleForm"给添加用户表单起的一个引用名称 -->
                <el-form-item label="角色名称" prop="roleName" label-width="100px">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑修改角色的对话框 -->
         <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName" label-width="100px">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 树形结构，:data="rightsList"绑定的数据源 
            :props=""指定数据绑定的字段，其中有：通过那一个属性实现父子间嵌套的
            树形结构上看到的文本对应哪个数据字段
            show-checkbox给树形展示数据的前面加上复选框
            node-key="id"指定选中树形结构的某个节点，其实是选中该节点对应的id值
            default-expand-all="true"默认展开所有树形节点
            default-checked-keys="defKeys"默认选中defKeys数组中对应的节点数据
            只需将展开列表中已有的三级权限的id值存入该defKeys数组即可在树形结构中展示其默认选中的权限了
            -->
            <el-tree ref="treeRef" :default-checked-keys="defKeys" default-expand-all="true" node-key="id" show-checkbox :data="rightsList" :props="treeProps"></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRightDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created(){
        this.getRolesList();
    },
    data(){
        return{
            // 所有角色列表数据
            rolesList:[],
            // 控制添加角色对话框的显示
            addDialogVisible:false,
            addForm:{
                roleName:'',
                roleDesc:'',
            },
             // 添加角色表单数据验证规则的对象
            addFormrules:{
                roleName:[
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                roleDesc:[
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }                    
                ],
                
            },
            // 控制修改角色对话框的显示
            editDialogVisible:false,
            // 存放修改角色数据的对象
            editForm:{},
            // 修改角色表单数据验证规则的对象
            editFormRules:{
                roleName:[
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                roleDesc:[
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }                    
                ],
                
            },
            // 控制分配权限对话框的显示
            setRightDialogVisible:false,
            // 所有权限列表数据
            rightsList:[],
            // element-ui树形组件的绑定对象
            treeProps:{
                label:'authName',
                children:'children',
            },
            // 默认选中的节点id值的数组
            // 只需将展开列表中已有的三级权限的id值存入该数组即可
            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:'',
        }
    },
    methods:{
        // 获取角色列表
        async getRolesList(){
            const {data:res} = await this.$http('roles');
            if(res.meta.status!==200) return this.$message.error('获取角色列表失败！');
            this.rolesList = res.data;
            console.log(this.rolesList);
        },
        // 通过id来删除对应的三级权限
        async removeRightById(role,rightId){
            // 弹窗提示用户是否要进行删除,其返回结果是promise对象
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err=>err);
            if(confirmResult!=='confirm') return this.$message('已取消删除');
            // console.log('确认了删除');
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
            if(res.meta.status !== 200) return this.$message.error('权限删除失败');
            // this.getRolesList();
            // 将服务器返回的最新数据直接赋值给每一行数据，从而避免页面的整体渲染
            role.children = res.data;
            this.$message.success('权限删除成功');
        },
        // 监听添加用户对话框的关闭事件，该事件被触发时清空所有表单中的输入内容
        addDialogClosed: function(){
            // 通过表单的引用对象来获取表单对象，在调用表单对象的重置方法
            // 即可实现表单的重置
            this.$refs.addFormRef.resetFields();
        },
        // 对话框中表单数据的预校验
        addRole: function(){
            // 表单预校验也需要获取表单对象
            this.$refs.addFormRef.validate(
                async (valid)=>{
                    console.log(valid);
                    if(!valid) return;
                    // 可以发起添加用户的网络请求
                    const {data:res} = await this.$http.post('roles',this.addForm);
                    if(res.meta.status!==201){
                        this.$message.error('添加角色失败');
                    }
                    this.$message.success('添加角色成功');
                    // 用户添加成功后关闭对话框
                    this.addDialogVisible = false;
                    // 对话框关闭后，需从服务器端查询数据，并显示到页面上
                    this.getRolesList();
                });
        },
        // 展示编辑角色的对话框
        showEditDialog: async function(id){
            // console.log(id);
            const{data:res} = await this.$http.get('roles/' + id);
            if(res.meta.status !==200){
                return this.$message.error('查询角色失败');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听修改角色对话框的关闭事件，该事件被触发时清空所有表单中的输入内容
        editDialogClosed: function(){
            this.$refs.editFormRef.resetFields();
        },
        // 修改角色信息并提交
        editRoleInfo: function(){
            this.$refs.editFormRef.validate(async val =>{
                console.log(val);
                if(!val) return;
                //发起修改用户数据信息的请求
                const {data:res} = await this.$http.put('roles/'+ this.editForm.roleId,{
                    id:this.editForm.roleId,
                    roleName:this.editForm.roleName,
                    roleDesc:this.editForm.roleDesc,
                })
                // 更新数据失败
                if(res.meta.status !==200){
                    return this.$message.error('更新角色信息失败');
                }
                // 更新数据成功
                this.editDialogVisible=false;
                this.getRolesList();
                this.$message.success('更新角色信息成功');
            })
        },
        // 根据角色id删除对应的用户数据信息
        removeRoleById: async function(id){
            // console.log(id);
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
            const {data:res} = await this.$http.delete('roles/' + id);
            if(res.meta.status !==200) return this.$message.error('角色删除失败');
            this.$message.success('角色删除成功');
            this.getRolesList();
            

        },
        // 展示分配权限的对话框
        async showSetRightDialog(role){
            // 存储当前角色的id值，供后续使用
            this.roleId = role.id;
            // 获取所有权限数据，这里获取的数据格式，是树形结构，
            // 不在是前面用于展示的列表结构
            const {data:res} = await this.$http.get('rights/tree');
            if(res.meta.status!==200) return this.$message.error('获取权限数据失败');
            this.rightsList = res.data;
            // console.log(this.rightsList);

            // 递归获取三级节点的Id
            this.getLeafKeys(role, this.defKeys)

            this.setRightDialogVisible=true;
        },
        // 通过递归的形式，获取角色下所有三级权限的id，
        // 并保存到defKeys数组中
        //  getLeafKeys()中node参数判断该节点是否为三级节点
        //  是的话就存在arr数组中
        getLeafKeys(node, arr) {
          // 如果当前 node 节点不包含 children 属性，则是三级节点
          if (!node.children) {
            return arr.push(node.id)
          }
    
          node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 监听分配权限对话框的关闭事件，分配权限对话框关闭时
        // 其每一行角色携带的默认权限会从权限树的默认权限数组中被删去
        // 从而防止影响下一个角色权限分配其权限树的默认权限选择情况
        setRightDialogClosed(){
            this.defKeys = [];
        },
        // 点击分配权限，权限分配对话框底部确定按钮绑定的事件处理函数
        // 获取权限树上所有已选中和半选中的一、二、三级节点，并将其推送到服务器端
        // 这就需要用到树形组件对象下面的全选节点和板悬节点获取方法
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(555555555,keys);
            // 将权限节点构成的数组，转换成以','连接的字符串
            // 作为请求参数发送给服务器端
            const idStr = keys.join(',');
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
            if(res.meta.status !==200) return this.$message.error('角色权限分配失败');

            this.$message.success('角色权限分配成功');
            this.getRolesList();
            this.setRightDialogVisible = false;
        }
    },
}
</script>

<style lang="less" scoped>
    // 使权限纵向上居中对齐
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>