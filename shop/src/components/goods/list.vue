<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 首行查询区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格渲染区 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"  width="70px"></el-table-column>
                <el-table-column label="创建时间"  width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="145px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="min"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="min" @click="removeGoodsById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
             <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
             :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
             layout="total, sizes, prev, pager, next, jumper" :total="total" background="">
    </el-pagination>
        </el-card>

    </div>
</template>

<script>
export default {
    created(){
        this.getGoodList();
    },
    data(){
        return{
            // 分页查询的相关设置
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            // 查询回来的商品列表数据
            goodsList:[],
            // 查询回来的总的数据条数
            total:0,
        }
    },
    methods:{
        // 根据分页查询的设置要求，查询数据
        async getGoodList(){
           const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
           if(res.meta.status!==200) return this.$message.error('查询商品数据失败');
            //this.$message.success('查询商品数据成功');
            //console.log(res.data);
            // 根据查询条件，查回来的的数据，存入vue数据容器中，供后续的页面渲染
            this.total = res.data.total;
            this.goodsList = res.data.goods;
        },
        // 分页区只要触发了该分页设置的事件处理函数，就可以拿到最新的页数newPageSize
        handleSizeChange(newPageSize){
            this.queryInfo.pagesize = newPageSize;
            this.getGoodList();
        },
        // 分页区只要触发了该分页设置的事件处理函数，就可以拿到最新的当前页newPagenum
        handleCurrentChange(newPagenum){
            this.queryInfo.pagenum = newPagenum;
            this.getGoodList();
        },
        // 再点击删除某一商品的删除按钮时，传递该商品的id，以此来删除该商品
        async removeGoodsById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            if(confirmResult!=='confirm') {return this.$message.info('已取消删除');}
            const {data:res} = await this.$http.delete('goods/' + id);
            if(res.meta.status!==200) return this.$message.error('删除数据失败');
            this.$message.success('删除数据成功');
            this.getGoodList();
        },
        // 点击添加商品按钮，跳转到添加商品页面
        goAddPage(){
            // 点击按钮，跳转页面
            this.$router.push('goods/add');
        },

    },

}
</script>

<style lang="less" scoped>

</style>