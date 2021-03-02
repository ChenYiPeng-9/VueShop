<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类数据表格显示取 -->
            <tree-table class="treeTable" :data='cateList' :columns='columns' :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 在表格中通过slot="isok"定义了一个模板插槽isok 
                其会被对应绑定的模板列所使用的，
                通过slot-scope="scope"来获取这一行的数据，供这个slot="isok"模板插槽使用
                -->
                <!-- 是否有效魔板插槽内容，供树形列表的模板列使用，即供对应的模板插槽使用 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color: lightgreen;"
                    v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <!-- 排序模板插槽内容，供树形列表的模板列使用，即供对应的模板插槽使用 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作模板插槽内容，供树形列表的模板列使用，即供对应的模板插槽使用 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCatDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCatById(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 页面分页展示区 -->
            <el-pagination  @size-change="handleSizeChange"  @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"  :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"  layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类数据的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="addCatDialogClosed">
            <!-- 添加分类的表单 -->
            <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCatForm" label-width="100px" >
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCatForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" >
                    <!--:options="parentCatList"用于指定级联选择器的数据源，:props属性用于设置配置对象  
                    v-model="selectedKeys"将选中的值双向绑定到selectedKeys数组中，
                    由于是级联选择器，所以会将父级id以及id都存储到数组中，且分别对应数组的第一项和第二项
                    @change="parentCatChanged"只要级联选择器的选中项发生了变化就会立即触发相应的事件处理函数parentCatChanged
                    clearable可删除级联选择框中的内容，change-on-select允许选择任意一级的分类 -->
                    <el-cascader expand-trigger="hover" :options="parentCateList" :props="{expandTrigger: 'hover' ,...cascaderProps}" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select >
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addCatDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addCat">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加编辑分类数据的对话框 -->
        <el-dialog title="修改分类" :visible.sync="editCatDialogVisible" width="50%" @close="editCatDialogClosed">
            <el-form :model="editCatDialogForm" :rules="editCatDialogFormRules" ref="editCatDialogForm" label-width="100px" >
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="editCatDialogForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editCatDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editCatInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created(){
        this.getCateList();
    },
    data(){
        return {
            // 获取商品分类的数据列表
            cateList:[],
            // 查询商品分类数据的查询条件,即请求参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类的全部数据
            total:0,
            // 为树形列表配置列
            columns:[{
                label:'分类名称',
                prop:'cat_name',
            },
            {
                label: '是否有效',
                // 表示将当前列定义为模板列
                type: 'template',
                // 表示当前这一列使用的模板插槽名称
                // 该模板插槽在树形表格的结构展示部分定义
                template:'isok'
            },
            {
                label: '排序',
                // 表示将当前列定义为模板列
                type: 'template',
                // 表示当前这一列使用的模板插槽名称
                // 该模板插槽在树形表格的结构展示部分定义
                template:'order'
            },
            {
                label: '操作',
                // 表示将当前列定义为模板列
                type: 'template',
                // 表示当前这一列使用的模板插槽名称
                // 该模板插槽在树形表格的结构展示部分定义
                template:'opt'
            }
            ],
            // 控制添加分类对话框的隐藏与显示
            addCatDialogVisible:false,
            // 用于存放添加分类数据的对象
            addCatForm:{
                // 将要添加分类的名称
                cat_name:'',
                // 父级分类的id
                cat_pid: 0,
                // 分类的等级，默认要添加的是1级分类
                cat_level: 0,
            },
            // 用于存放添加分类数据规则的对象
            addCatFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },
            // 添加分类中所要使用的父级分类列表
            parentCateList:[],

            // 指定级联选择器的配置对象
            cascaderProps: {
              // 指定级联选择器选中的值
              value: 'cat_id',
              // 指定级联选择器选中的值所看到的样子
              label: 'cat_name',
              // 指定级联选择其中父子嵌套所依赖的属性
              children: 'children',
            },
            // 选中的父级分类的id数组
            selectedKeys:[],
           
            // 控制编辑分类对话框的显示与隐藏
            editCatDialogVisible:false,
            // 编辑分类对话框中编辑数据的校验规则
            editCatDialogFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 编辑分类的数据
            editCatDialogForm:{},
        }
    },
    methods:{
        // 获取商品分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories', {params:this.queryInfo});
            if(res.meta.status!==200) return this.$message.console.error('请求商品分类数据失败');
            // 把数据列表赋值给cateList对应的Vue数组
            this.cateList = res.data.result;
            this.total = res.data.total;
            // console.log(9999,this.cateList);
        },
        // 监听pagesize改变的事件处理函数
        // 只要pagesize改变了，我们就给他赋值到请求参数queryInfo中的pagesize上面
        // 进行每页多少数据的新的数据查询
        handleSizeChange(newSize){
            // 查询条件改变了
            this.queryInfo.pagesize = newSize;
            // 进行新查询设置的数据查询
            this.getCateList();
        },
        // 监听pagenum改变的事件处理函数
        // 只要pagenum改变了，我们就给他赋值到请求参数queryInfo中的pagenum上面
        // 进行对第几页数据查询的新数据查询
        handleCurrentChange(newPage){
            // 查询条件改变了
            this.queryInfo.pagenum = newPage;
            // 进行新查询设置的数据查询
            this.getCateList();
        },
        // 单击添加按钮，展示添加分类的对话框
        showAddDialog(){
            // 先获取父级分类数据
            this.getParentCatList()
            // 在展示添加分类的对话框
            this.addCatDialogVisible = true;
        },

        // 级联选择器选择项发生变化时触发的事件处理函数
        parentCateChanged() {
            console.log(this.selectedKeys);
            // 如果selectedKeys数组中的length大于0，证明选中了父级分类
            // 反正就说明没有选中任何父级分类
            if(this.selectedKeys.length>0){
              // 父级分类的id
              this.addCatForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
              // 当前分类的等级赋值
              this.addCatForm.cat_level = this.selectedKeys.length;
              return;
            }else{
              // 父级分类的Id
              this.addCatForm.cat_pid = 0;
              // 当前分类的等级赋值
              this.addCatForm.cat_level=0;
            }
        },
        // 点击对话框中的确定按钮，添加新分类
        addCat(){
          this.$refs.addCatForm.validate(async valid =>{
            if(!valid) return;
            const {data:res} = await this.$http.post('categories',this.addCatForm);
            if(res.meta.status!==201) return this.$message.error('添加分类失败');
            this.addCatDialogVisible=false;
            this.$message.success('添加分类成功');
            this.getCateList();
          });
        },
        // 添加分类对话框关闭，则清空其中内容
        addCatDialogClosed(){
          // 清空表单输入框相关的内容
          this.$refs.addCatForm.resetFields();
          // 清空级联选择框绑定的selectedKeys数组中的内容
          // 以及与级联选择框有关联的一些数据
          this.selectedKeys=[];
          this.addCatForm.cat_level=0;
          this.addCatForm.cat_pid=0;

        },
        // 展示编辑分类的对话框
        async showEditCatDialog(id){
            const {data:res} = await this.$http.get('categories/' + id);
            if(res.meta.status !==200){
                return this.$message.error('查询分类失败');
            }
            this.editCatDialogForm = res.data;
            this.editCatDialogVisible = true;
        },
        // 监听修改分类对话框的关闭事件，该事件被触发时清空所有表单中的输入内容
        editCatDialogClosed(){
            this.$refs.editCatDialogForm.resetFields();
        },
        // 修改分类信息并提交
        editCatInfo(){
            this.$refs.editCatDialogForm.validate(async val =>{
                // console.log(val);
                if(!val) return;
                //发起修改分类信息的请求
                const {data:res} = await this.$http.put('categories/'+ this.editCatDialogForm.cat_id,{
                    cat_name:this.editCatDialogForm.cat_name,
                })
                // 更新数据失败
                if(res.meta.status !==200){
                    return this.$message.error('更新分类信息失败');
                }
                // 更新数据成功
                this.editCatDialogVisible=false;
                this.getCateList();
                // this.cateList = res.data.result;
                this.$message.success('更新分类信息成功');
            })
        },
        // 删除分类数据
        async removeCatById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            // console.log(confirmResult);
            if(confirmResult!=='confirm'){
                return this.$message.info('已取消删除');
            }
            const {data:res} = await this.$http.delete('categories/'+id);
            if(res.meta.status !==200) return this.$message.error('分类删除失败');

            this.$message.success('分类删除成功');;
            this.getCateList();
        },
    },
}
</script>

<style lang="less" scoped>
    .treeTable{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>