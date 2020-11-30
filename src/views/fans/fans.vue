<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <my-breadcrumb>粉丝管理</my-breadcrumb>
      </div>
      <!-- tabs -->
<el-tabs v-model="activeName" type="card" @tab-click="hTabChange">
<el-tab-pane label="列表" name="list">
          <div class="fans_list">
            <div class="fans_item"
            v-for="fan in fans"
            :key="fan.id.toString()">
              <el-avatar :size="80"
              :src="fan.photo"></el-avatar>
              <p>{{fan.name}}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            style="margin-top: 1em;"
            background
            :page-size="per_page"
            layout="prev, pager, next"
             @current-change="hPageChange"
            :total="total_count">
          </el-pagination>

        </el-tab-pane>
<el-tab-pane label="画像" name="echart">
          <div>画像-echarts</div>
          <!-- 下面的dom用来充当echarts画图的容器
            注意： 一定要有宽，高 -->
          <div id="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'my-fans',
  data () {
    return {
      // tabs的当前激活选项卡的name属性值
      per_page: 30, // 每页显示几条
      page: 1, // 当前页码
      total_count: 0, // 总数据条数
      activeName: 'list',
      fans: []
    }
  },
  created () {
    this.loadFans()
  },
  methods: {
    // 对获取回来的数据进行加工
    buildData (ageObj) {
      // ageObj: {
      //   gt50: 78,
      //   le18: 61,
      // }
      // const xAxis = ['gt50', 'le18']
      const xAxis = Object.keys(ageObj).map(item => {
        return item.replace('gt', '大于').replace('le', '小于')
      })

      const data = Object.values(ageObj)

      return {
        xAxis,
        data
      }
    },
    async draw () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main'))

      const res = await this.$http({
        url: '/mp/v1_0/statistics/followers',
        method: 'GET'
      })

      console.log('获取粉丝统计数据，age', res.data.data.age)
      // 加工请求回来的数据
      const result = this.buildData(res.data.data.age)

      // 指定图表的配置项和数据： 填入加工后的数据
      const option = {
        tooltip: {},
        legend: {
          data: ['人数']
        },
        xAxis: {
          data: result.xAxis
        },
        yAxis: {},
        series: [
          // { name: '销量', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
          { name: '人数', type: 'line', data: result.data }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    hTabChange (tab) {
      // 监听用户切换tab，
      // console.log(tab)
      // 如果用户切到了 “画像” ，这时去画echarts图表
      if (tab.name === 'echart') {
        this.draw()
      }
    },

    hPageChange (curpage) {
      // 1. 更新页码
      this.page = curpage
      // 2. 重发请求
      this.loadFans()
    },
    async loadFans () {
      const res = await this.$http({
        url: '/mp/v1_0/followers',
        method: 'GET',
        params: {
          page: this.page,
          per_page: this.per_page
        }
      })
      console.log('获取粉丝列表数据', res)
      this.fans = res.data.data.results
      this.total_count = res.data.data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    padding-top: 10px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>
