<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 头部搜索区 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格订单数据展示区 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" >
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template> 
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <!-- 下单时间的时间格式需要用全局过滤器进行处理 -->
                <el-table-column label="下单时间" >
                    <template  slot-scope="scope">
                        {{scope.row.create_time |dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 订单列表的分页区 -->
             <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange"
             :current-page="queryInfo.pagenum" :page-sizes="[10, 15, 20, 25]"
             :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
             :total="total">
            </el-pagination>
        </el-card> 
         <!--修改地址的对话框  -->
        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover',...cityDataProps }"  @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addressVisible = false">取 消</el-button>
              <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%" @close="progressDialogClosed">
            <el-timeline>
                 <!-- Timline时间线 -->
                 <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                   {{activity.context}}
                 </el-timeline-item>
            </el-timeline>
            
        </el-dialog>    
    </div>
</template>

<script>
// 导入级联选择器所要使用的省市区县数据
import cityData from './citydata'
export default {
    created(){
        this.getOrderList();
    },
    data(){
        return{
            // 用于存放从服务器端获取的订单数据
            orderList:[],
            // 用于存放从数据端获取的总的数据条数
            total:0,
            // 用于存放向服务器端发起的查询条件
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            // 控制修改地址对话框的显示和隐藏
            addressVisible:false,
            // 用于存放修改地址对话框中，表单中数据
            addressForm:{
                address1:[],
                address2:'',
            },
            // 用于存放修改地址对话框中，表单中数据的对话框
            addressFormRules:{
                address1:[{ required: true, message: '请选择省市区县', trigger: 'blur' },],
                address2:[{ required: true, message: '请输入详细地址', trigger: 'blur' },],
            },
            // 将省市区县数据引入Vue对象中
            cityData:cityData,  
            // 级联选择框数据显示的设置
            cityDataProps:{
                label:'label',
                value:'value',
                children:'children'
            },
            // 控制展示物流进度对话框的隐藏与显示
            progressVisible:false,  
            // 用于存储获取的物流进度信息
            progressInfo:[
                {
                  "time": "2018-05-10 09:39:00",
                  "ftime": "2018-05-10 09:39:00",
                  "context": "已签收,感谢使用顺丰,期待再次为您服务",
                  "location": ""
                },
                {
                  "time": "2018-05-10 08:23:00",
                  "ftime": "2018-05-10 08:23:00",
                  "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                  "location": ""
                },
                {
                  "time": "2018-05-10 07:32:00",
                  "ftime": "2018-05-10 07:32:00",
                  "context": "快件到达 [北京海淀育新小区营业点]",
                  "location": ""
                },
                {
                  "time": "2018-05-10 02:03:00",
                  "ftime": "2018-05-10 02:03:00",
                  "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                  "location": ""
                },
                {
                  "time": "2018-05-09 23:05:00",
                  "ftime": "2018-05-09 23:05:00",
                  "context": "快件到达 [北京顺义集散中心]",
                  "location": ""
                },
                {
                  "time": "2018-05-09 21:21:00",
                  "ftime": "2018-05-09 21:21:00",
                  "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                  "location": ""
                },
                {
                  "time": "2018-05-09 13:07:00",
                  "ftime": "2018-05-09 13:07:00",
                  "context": "顺丰速运 已收取快件",
                  "location": ""
                },
                {
                  "time": "2018-05-09 12:25:03",
                  "ftime": "2018-05-09 12:25:03",
                  "context": "卖家发货",
                  "location": ""
                },
                {
                  "time": "2018-05-09 12:22:24",
                  "ftime": "2018-05-09 12:22:24",
                  "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                  "location": ""
                },
                {
                  "time": "2018-05-08 21:36:04",
                  "ftime": "2018-05-08 21:36:04",
                  "context": "商品已经下单",
                  "location": ""
                }
            ],
        }
    },
    methods:{
        // 从服务器端获取订单数据
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo});
            if(res.meta.status!==200) return this.$message.error('获取订单列表数据失败');
            this.orderList = res.data.goods;
            this.total = res.data.total;
            console.log(this.orderList);
        },
        // 监听分页区每页多少条数据的改变，可以拿到最新的每页多少条数据
        handleSizeChange(newpagesize){
            this.queryInfo.pagesize = newpagesize;
            this.getOrderList();
        },
        // 监听分页区当前页的改变，可以拿到最新的当前页数据
        handleCurrentChange(newpagenum){
            this.queryInfo.pagenum = newpagenum;
            this.getOrderList();
        },
        // 点击编辑按钮，弹出选择省市联动的对话框，即修改地址的对话框
        showBox(){
            this.addressVisible=true;
        },
        // 级联选择框选择所触发的事件
        handleChange(){
            console.log(this.addressForm)
        },
        // 监听对话框的关闭事件，对话框一旦被取消则置空其中的内容
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields();
        },
        // 点击定位按钮，打开查看物流进度的对话框
        async showProgressBox(){
            // const {data:res} = await this.$http.get('/kuaidi/804909574412544580');
            // if(res.meta.status!==200){
            //     return this.$message.error('获取物流进度失败');
            // }
            // this.progressInfo = res.data;
            this.progressVisible = true;
            // console.log(this.progressInfo);
            
        },
        // 监听物流进度展示对话框的隐藏与显示
        progressDialogClosed(){},
    },
}
</script>

<style lang="less" scoped>
// 导入TimeLine的样式文件，才能给TimeLine组件设置相关的样式
    @import '../../plugins/timeline/timeline.css';
    @import '../../plugins/timeline-item/timeline-item.css';
    .el-cascader{
        width: 100%;
    }
</style>