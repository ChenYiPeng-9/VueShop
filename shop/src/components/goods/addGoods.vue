<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 头部提示区域 -->
             <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
            <!-- 步骤条区域 -->
            <!-- :active=""属性用于控制步骤跳，哪一个步骤被激活,这里将其动态绑定到Vue对象变量activeIndex上
            实现数据的联动，即控制步骤条进展到那一步了 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- Tab栏区域 -->
            <!-- Tab栏v-model="activeIndex"会将每个页签的name属性绑定到v-mode属性绑定的属性值上
            这个属性值变两同为控制步骤条进度的变量，区别是，分页这边是字符串存到activeIndex中，
            来控制步骤条则需要将字符串转换为数值减0即可 -->
            <!--el-tab-pane只能是el-tabs的子节点，所以要把一个大表单放在外面el-form，把tab相关控件全部包括在内,
            然后再将一个个小表单控件el-form-item塞入tab栏中的每个页面即可  -->
            <!-- 大表单绑定的数据对象，即为向服务器端发送请求时，需要的数据构成的对象
            小表单即为发送请求时需要的一项项请求参数数据，所以这里小表单绑定的数据名称要与服务器请求参数
            的名称一一对应，不能乱写！！！！ -->
            <!--tab栏的:before-leave属性用于控制标签页的切换功能  -->
            <!--tab栏的切换会触发@tab-click事件 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options=" cateList" 
                            :props="{ expandTrigger: 'hover',...cascaderProps }" @change="handleChange">
                            </el-cascader>
                        </el-form-item>  
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <!-- 大循环动态参数，小循环动态参数的属性，即动态参数attr_vals属性中的数据 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
                              <!--v-model="item.attr_vals"复选框绑定的数据数组，即通过复选框的勾选状况，可以删除这个数组中的数据  -->
                              <el-checkbox-group v-model="item.attr_vals">
                                  <!-- 索引i，cb是动态参数的每一个属性 -->
                                  <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                                </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- ui-element的上传组件 -->
                        <!--action属性，图片上传到后台服务器的api接口地址，list-type属性指定预览组件的呈现方式
                        :on-preview图片预览的事件处理函数，:on-remove上传图片被删除的事件处理函数
                         -->
                         <!-- 注意这里的上传组件是内部自己封装的ajax，其上传图片到服务器并不是走的我们的axios，
                         所以就没办法通过axios的请求拦截器，给请求加上token，所以这里需要通过:headers属性指定请求头，
                         即手动给上传图片加上token信息,:on-success属性，文件上传一旦成功，则触发该事件
                          -->
                        <el-upload :action="uploadUrl" :on-preview="handlePreview" 
                          :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 父文本编辑器组件 -->
                        <!-- 将父文本编辑器中的内容通过v-model="addForm"双向绑定到添加商品的请求参数上 -->
                        <quill-editor v-model="addForm.goods_introduce">

                        </quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>    
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
// 导入lodash 这个可以进行深拷贝的三方模块
import _ from 'lodash'
export default {
    created(){
        this.getCateList();
    },
    data(){
        return{
            // 实现步骤条和tab栏的联动的变量
            activeIndex:'0',
            // 存储添加商品信息表单数据的对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 用于存储级联选择器选择数据背后值的数组
                goods_cat:[],
                // 用于存储图片上传到服务器的临时存放路径
                // 作为添加商品的请求参数，
                pics:[],
                // 商品的详情描述
                goods_introduce:'',
                // 存储商品的动态参数和静态属性的数组
                attrs:[],
            },
            // 存储添加商品信息表单数据规则的对象
            addFormRules:{
                goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' }],
                goods_cat:[{ required: true, message: '请选择商品分类', trigger: 'blur' }],
            },
            // 用于存储获取回来的用于级联选择器进行展示的商品分类数据
            cateList:[],
            // 设置级联选择器的显示规则
            cascaderProps:{
                // 看起来
                label:'cat_name',
                // 看起来背后的值
                value:'cat_id',
                // 级联嵌套的属性
                children:'children',
            },
            // 用于存储服务器端返回的动态参数列表数据，
            // 以供商品参数tab栏页面的页面数据渲染
            manyTableDate:[],
            // 用于存储服务器端返回的静态属性列表数据，
            // 以供商品属性tab栏页面的页面数据渲染
            onlyTableDate:[],
            // 上传图片的url地址,地址应该是完整的url地址
            uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 图片预览的完整真实图片路径
            previewPath:'',
            // 控制图片预览对话框的隐藏和显示
            previewVisible:false,
        }
    },
    methods:{
        // 获取商品的所有分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories');
            if(res.meta.status!==200) return this.$message.error('获取商品分类数据失败');
            this.cateList = res.data;
            console.log(this.cateList);
        },
        // 级联选择器，选择数据所触发的事件处理函数
        handleChange(){
            // console.log(this.addForm.goods_cat);
            // 分类数据的级联选择器，这里只允许选择三级分类
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[];
            }
        },
        // 标签页切换的事件处理函数
        // 在这个事件处理函数中
        // 只要return false即可阻止标签页的切换
        // 可以获取即将离开的标签页名称',oldActiveName
        // 可以获取即将进入的标签页名称',activeName
        beforeTabLeave(activeName,oldActiveName){
            // console.log('即将离开的标签页名称',oldActiveName);
            // console.log('即将进入的标签页名称',activeName);
            if(oldActiveName === '0'&& this.addForm.goods_cat.length!==3){
                this.$message.error('请先选择商品分类');
                return false;
            }
        },
        // tab栏切换页面时所触发的事件
        async tabClicked(){
            // console.log(this.activeIndex);
            // 页签对应的激活值为1，说明当前访问的是动态参数面板
            if(this.activeIndex === '1'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}});
                if(res.meta.status!== 200) return this.$message.error('动态参数获取失败');
                // console.log(res.data);
                // 将服务器返回的动态参数的attr_vals属性转换成数组，便于后续复选框的渲染
                res.data.forEach(item =>{
                    item.attr_vals = item.attr_vals.length === 0? []:item.attr_vals.split(',');
                })
                this.manyTableDate = res.data;
                console.log(this.manyTableDate);
            }else if(this.activeIndex === '2'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}});
                if(res.meta.status!== 200) return this.$message.error('静态属性获取失败');
                this.onlyTableDate = res.data;
                console.log(this.onlyTableDate);
            }

        },
        // 处理图片预览的效果,这里file是被点开的那个图片的信息对象
        handlePreview(file){
            console.log(file)
            // 从被点开的那个图片的信息对象中获取该图像的完整的url地址
            // 不是下面删除操作，即请求参数中所需的临时存放路径了
            this.previewPath = file.response.data.url;
            // 触发图片预览事件的时候，打开预览图片的对话框
            this.previewVisible = true;
        },
        // 处理移除图片的操作，这里file是将要被移除的那个图片的信息对象
        // 删除上传的图片，其关键就是从这个删除图片的信息对象中找到图片的临时存放路径
        handleRemove(file){
            // console.log(file);
            // 1.获取将要删除图片的临时路径
            const filePath = file.response.data.tmp_path;
            // 2.从添加商品的请求参数pics数组中，找到这个图片对应的索引值
            // x代表pics数组里的每一项
            const i = this.addForm.pics.findIndex(x => x.pic===filePath);
            // 3.调用数组的splice方法，把图片的临时存放路径从pics数组中移除
            this.addForm.pics.splice(i,1);
            console.log(this.addForm);
        },
        // 监听图片上传成功的事件,
        handleSuccess(response){
            console.log(response);
            // 图片上传成功后，获取图片的临时存放路径，作为添加商品表单的请求参数之一
            // 1.拼接得到一个图片信息对象
            const picInfo = {pic:response.data.tmp_path};
            // 2.将图片信息对象，即图片临时存放路径，push到添加商品的请求参数的指定pic数组中
            this.addForm.pics.push(picInfo);
            console.log(this.addForm);
        },
        // 点击添加商品按钮，先对由请求参数构成的表单进行预验证
        // 验证通过后实现添加商品的表单向服务器端的提交
        add(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return this.$message.error('请填写必要的表单项');
                // 下面执行添加商品的业务逻辑
                // 首先是将我们当前的和提交请求相关的请求参数，转换称满足服务器要求的请求参数类型
                // 1.将便于级联选择框渲染的goods_cat数组，转换成满足服务器请求参数格式的goods_cat字符串
                // 使用一个三方依赖对goods_cat数组进行深拷贝，从而获得一个数组和一个字符串分别供级联选择器，
                // 和服务器请求参数使用，两者互不相干就不会报错了
                // lodash    _.cloneDeep(obj) 这样一来form 和this.addForm就是两个完全不相干的对象了
                const form = _.cloneDeep(this.addForm);
                form.goods_cat = form.goods_cat.join(',');
                console.log(form);

                //2.处理请求参数 attrs由tab栏动态参数中参数构成的对象和静态属性中参数构成的对象的对象组合而成的数组，
                // 处理动态参数
                this.manyTableDate.forEach(item => {
                    const newInfo = {
                        attr_id :item.attr_id,
                        // 动态参数的attr_vals是一个数组，
                        // 要将其转回服务器所需的字符串请求参数格式
                        attr_vals:item.attr_vals.join(',')
                    }
                    this.addForm.attrs.push(newInfo)
                });
                // 处理静态属性
                this.onlyTableDate.forEach(item => {
                    const newInfo = {
                        attr_id :item.attr_id,
                        // 静态属性的attr_vals是一个字符串则不需要转换
                        attr_vals:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                });
                // 上面操作的是 this.addForm.attrs中的attrs
                // 我们要提交给哦服务器的是深拷贝的form
                form.attrs = this.addForm.attrs;
                console.log(form);

                // 发起请求添加商品
                // 商品的名称必须是唯一的
                const {data:res} = await this.$http.post('goods',form);
                if(res.meta.status !== 201) return this.$message.error('添加商品失败');
                this.$message.success('添加商品成功');
                this.$router.push('/goods');
            })
        },
    },
    computed:{
        // 获取三级分类id的值
        cateId(){
            if(this.addForm.goods_cat.length){
                return this.addForm.goods_cat[2];
            }
            // 没有三级分类id
            return null;
        },
    }
}
</script>

<style lang="less" scoped>
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .previewImg{
        width: 100%;
    }
    .btnAdd{
        margin-top: 15px;
    }

</style>