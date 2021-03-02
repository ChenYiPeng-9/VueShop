<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区 -->
            <el-alert title="注意:只允许为第三级分类设置参数" type="warning" :closable="false" show-icon></el-alert>
            <!-- 选择商品分类区 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader expand-trigger="hover" v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- Tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的页签面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <!-- 将按钮禁用属性:disabled与计算方法返回的值isBtnDisabled进行绑定 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加动态参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" stripe border>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <!-- closable @close="handleClose(i)"给标签绑定删除事件，点击标签上的小叉号，执行删除标签的有关业务逻辑 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 添加新的标签 -->
                                <!-- 用于将标签在按钮和文本框之间切换的文本框 -->
                                <!--scope.row.inputVisible，scope.row.inputValue每一行数据使用自己的inputVisible和inputValue
                                从而实现每行新建标签的数据独立-->
                                <!--handleInputConfirm()用于将文本输入框重新转换成按钮  -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 用于将标签在按钮和文本框之间切换的按钮 
                                @click="showInput(scope.row)"方法用于将按钮转换成文本输入框-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的页签面板 -->
                <el-tab-pane label="静态属性" name="only">  
                    <!-- 添加属性的按钮 -->
                  <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加静态属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" stripe border>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <!-- closable @close="handleClose(i)"给标签绑定删除事件，点击标签上的小叉号，执行删除标签的有关业务逻辑 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 添加新的标签 -->
                                <!-- 用于将标签在按钮和文本框之间切换的文本框 -->
                                <!--scope.row.inputVisible，scope.row.inputValue每一行数据使用自己的inputVisible和inputValue
                                从而实现每行新建标签的数据独立-->
                                <!--handleInputConfirm()用于将文本输入框重新转换成按钮  -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 用于将标签在按钮和文本框之间切换的按钮 
                                @click="showInput(scope.row)"方法用于将按钮转换成文本输入框-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                            </template>     
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加动态参数和静态属性共用一个对话框 -->
        <el-dialog :title="'添加' + titleText " :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                  <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数的对话框 -->
        <el-dialog :title="'修改' + titleText " :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                  <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    // 页面一旦加载就获取所有的商品分类列表
    created(){
        this.getCateList();
    },
    data(){
        return{
         cateList:[],   
        //  级联选择框的配置对象
         cateProps:{
             value:'cat_id',
             label:'cat_name',
             children:'children'
         },
        //  级联选择框双向绑定到的数组
        selectedCateKeys:[],
        // 默认被激活标签的名称,即打开页面时，哪一个标签项被选中
        activeName:'many',
        // 分别用于存储不同页签下对应的数据
        // 动态参数的数据
        manyTableData:[],
        // 静态属性的数据
        onlyTableData:[],
        // 控制添加动态参数/静态属性对话框的隐藏与显示
        addDialogVisible:false,
        // 控制添加动态参数/静态属性对话框中表单数据的存储
        addForm:{
             attr_name:'',
        },
        // 控制添加动态参数/静态属性对话框中表单数据的验证规则
        addFormRules:{
            attr_name:[
                { required: true, message: '请输入参数名称', trigger: 'blur' },
                { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
            ]
        },
        // 控制编辑动态参数/静态属性对话框的隐藏与显示
        editDialogVisible:false,
        // 控制编辑动态参数/静态属性对话框中表单数据的存储
        editForm:{},
        // 控制编辑动态参数/静态属性对话框中表单数据的验证规则
        editFormRules:{
          attr_name:[
                { required: true, message: '请输入参数名称', trigger: 'blur' },
                { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
            ]  
        },
        // 控制标签作为按钮和文本框之间的切换显示
        inputVisible:false,
        // 文本框中输入的内容
        inputValue:'',
        }
    },
    methods:{
        //获取所有的商品分类列表 
        async getCateList(){
            const {data:res} = await this.$http.get('categories');
            if(res.meta.status !==200) return this.$message.error('获取参数列表失败');
            this.cateList = res.data;
            console.log(999,this.cateList);
        },
        // 级联选择框选择项发生改变所触发的事件
        async handleChange(){
            this.getParamsData();
        },
        // 标签项选择所触发的事件处理函数
        handleTabClick(){
            // console.log(this.activeName);
            this.getParamsData();
        },
        // 获取三级分类情况下，任意页签面板所对应的数据,
        // 在不同情况下调用该函数，即可实现切换页签和选择三级分类任意情况下都会发送请求获取数据了
        async getParamsData(){
            // 由于selectedCateKeys数组和级联选择框是双向数据绑定
            // 则可以根据数组中元素的个数，即数组长度判定，我们选的是几级分类
            if(this.selectedCateKeys.length!==3){
                // 证明选中的不是三级分类
                // 情况双向绑定的数组
                // 选的不是三级分类，页面渲染所用到的相关数据以及分类数组全部清空
                this.selectedCateKeys = [];
                this.manyTableData=[];
                this.onlyTableData=[];
                return;
            }
            // 证明选中的是三级分类
            // console.log(66666666,this.selectedCateKeys);
            // 选中三级分类了，则需要将三级分类下面的数据项给获取回来
            // 由于这个请求路由需要三级分类id，以及动态参数和静态属性相关的标志位
            // 则三级分类id可以通过计算属性获取，而标志位可以绑定到也标签的激活变量上
            // 即根据所选分类的id，以及也标签所处的面板，发起不同数据的请求
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
            if(res.meta.status!==200) return this.$message.error('数据获取失败');
            // 将attr_val属性中存的字符串数据，转为数组
            res.data.forEach(item => {
                // 判断attr_vals属性中的字符串是否为空，如果为空直接返回一个空数组
                // 这样就避免了在新建动态参数时，或是本来参数的attr_vals属性是一个空字符串
                // 带来的标签显示问题了
                item.attr_vals = item.attr_vals? item.attr_vals.split(','): [];
                // 给每行数据自身添加这两个属性，用于每一行上新建标签时使用，这样不同行新建标签就不会因为
                // 共用inputVisible，和inputValue而发生数据关联了
                // 控制文本框的显示与隐藏
                item.inputVisible = false;
                // 文本框中输入的值
                item.inputValue = '';
            });
            console.log(res.data);
            // console.log(res.data);
            // 判断获取的数据属于哪一个页签下的数据在进行对应的页签版面渲染
            if(this.activeName === 'many'){
                this.manyTableData = res.data;
            }else{
                this.onlyTableData = res.data;
            }
            console.log(3,this.manyTableData);
            // console.log(this.onlyTableData);
        },
        // 当添加动态参数/静态属性所触发的事件处理函数
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        // 对添加的动态参数/静态属性做预校验校验成功后提交到后台服务器端
        addParams(){
             this.$refs.addFormRef.validate( async valid =>{
                 if(!valid) return;
                 const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                     attr_name:this.addForm.attr_name,
                     attr_sel:this.activeName,
                 });
                 if(res.meta.status!==201) return this.$message.error('参数添加失败');

                 this.$message.success('参数添加成功');
                 this.addDialogVisible = false;
                 this.getParamsData();
             })
        },
        // 点击修改按钮弹出对话框的事件处理函数
        // 根据id来查询参数数据
        async showEditDialog(id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}});
            if(res.meta.status!==200) return this.$message.error('获取分类信息失败');
            // this.$message.success('获取分类信息成功');
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 当修改动态参数/静态属性所触发的事件处理函数
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        // 点击修改参数对话框中的确定按钮，对修改的数据进行预校验，
        // 预校验成功后提交到服务器端
        editParams(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return;
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    attr_sel: this.activeName,
                    attr_name: this.editForm. attr_name
                });
                if(res.meta.status!==200) return this.$message.error('更新数据失败');
                this.$message.success('更新数据成功');
                this.editDialogVisible = false;
                this.getParamsData();
            });
        },
        // 点击删除按钮，根据id删除该数据
        async removeParamsById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            if(confirmResult !=='confirm'){
                return this.$message.info('已取消删除');
            }else{
                const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
                if(res.meta.status!==200) return this.$message.error('删除数据失败');
                this.$message.success('删除数据成功');
                this.editDialogVisible = false;
                this.getParamsData();
            }
             
        },
        // 标签在按钮和文本框中来回切换，对应文本框失去焦点和键盘敲击enter键所触发的事件
        async handleInputConfirm(row){
            if(row.inputValue.trim().length === 0){
                // 判断文本书框中输入的内容是不是没有用，
                // 如果没用则清空inputValue
                row.inputValue = '';
                // 隐藏文本输入框，切换成按钮
                row.inputVisible = false;
                return;
            }
            // 如果没有return，则证明输入的内容有用则需要做后续的处理
            // 数据有用的话就把他给压入每行数据对应的attr_vals属性中
            // 因为我们的标签都是循环这个属性对应的数组得来的
            row.attr_vals.push(row.inputValue.trim());
            // row.inputValue中数据压入attr_vals属性中之后，清空inputValue
            // 供下一个新建标签使用
            row.inputValue = '';
            row.inputVisible = false;
            // 发起服务器端的请求，持久化保存这次操作，即持久化保存attr_vals属性
            this.saveAttrValues(row);
        },
        // 标签在按钮和文本框中来回切换，处于按钮情况，点击时切换成文本输入框
        showInput(row){
            row.inputVisible = true;
            // 让文本输入框自动获得焦点
            // .$nextTick方法的作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
            // 这里需要注意一点row.inputVisible = true;控制文本框显示的布尔值被设置为true
            // 页面上的元素还没有被重新渲染，页面上展示的还是button按钮，并不是文本输入框
            // 则这时候还需要等一个时机，即$nextTick被调用，元素渲染完成了，即页面上这个时候是input
            // 输入框了，再去获取这个文本输入框的焦点
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除标签对应的参数可选项，i是这个标签在数据数组attr_val中的索引
        // row是这一行的数据
        handleClose(i,row){
            // 从数组中删除索引为i的一个数据
            row.attr_vals.splice(i,1);
            this.saveAttrValues(row);
        },
        // 将向服务器端发起的修改行数据attr_vals属性中对应标签数据的请求进行抽离，以供多次调用
        async saveAttrValues(row){
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
               attr_name:row.attr_name,
               attr_sel:row.attr_sel,
               attr_vals:row.attr_vals.join(','), 
            });
            console.log(5656,res);
            if(res.meta.status!==200) return this.$message.error('修改属性标签失败');
            this.$message.success('修改属性标签成功');
        },
    },
    // 计算属性
    computed:{
        // 定义一个计算属性，根据其返回值情况来决定页签按钮的禁用状况
        // 如果页签上按钮需要被禁用则返回true，否则返回false
        isBtnDisabled(){
             if(this.selectedCateKeys.length!==3){
                 return true;
             }
             return false;
        },
        // 当前选中的三级分类的id
        cateId(){
             if(this.selectedCateKeys.length ===3){
                // 如果选中的是三级分类，则获取selectedCateKeys数组中的第二项
                // 即三级分类的id值
                 return this.selectedCateKeys[2];
             }
             return null;
        },
        // 动态计算添加**对话框的标题是添加动态参数还是添加动态属性
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数';
            }
            return '静态属性';
        },
    },
}
</script>

<style lang="less" scoped>
    .cat_opt {
        margin: 15px 0px;
    }
    .el-tag{
        margin:10px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>