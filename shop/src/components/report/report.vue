<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- echarts使用第二步:为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// echarts使用5步曲
// echarts使用第一步：导入echarts三方依赖
import echarts from 'echarts'
// 利用三方模块来讲服务器返回的报表数据，以及接口文档提供的
// 能实现报表跟随的数据进行合并
// 之前是使用这个三方模块进行深拷贝的
import _ from 'lodash'
export default {
    // 初始化echarts图表必须在页面上dom元素渲染完成后进行，
    // 所以这里需要借用Vue的另一个钩子函数mounted
    async mounted(){
        // echarts使用第三步：基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.$http.get('reports/type/1');
        if(res.meta.status!==200){
            return this.$message.error('获取折线图数据失败');
        }
        // echarts使用第四步：指定图表的配置项和数据
        // 图表数据来源于服务器响应的数据res.data，
        // 和接口文档提供必需结合数据的合并
        // 这里调用三方模块lodash对两者进行合并
       const result =  _.merge(res.data,this.options);

        // echarts使用第五步：用图表展示数据
        myChart.setOption(result);
    },
    created(){},
    data(){
        return{
            // 将服务器返回的数据和接口文档中提高的options
            // 数据合并，即下面这个options数据
            // 才可以完整的展示数据报表的折线图
            options: {
                title: {
                  text: '用户来源'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#E9EEF3'
                    }
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    boundaryGap: false
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ] }  
        }
    },
    methods:{

    },
}
</script>

<style lang="less" scoped>


</style>