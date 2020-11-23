<template>
  <div >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航
        https://element.eleme.cn/#/zh-CN/component/breadcrumb#tu-biao-fen-ge-fu -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="频道一" value="shanghai"></el-option>
            <el-option label="频道二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
                    v-model="form.dateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
    </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Ysearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top:1em">
      <div slot="header" class="clearfix">
       根据筛选条件查询到{{total_count}}条数据,当前是第{{curPage}}页：
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="封面"
          width="180">
          <template slot-scope="scope">
            <!-- lazy懒加载效果 https://element.eleme.cn/#/zh-CN/component/image#lan-jia-zai -->
            <!-- <span>{{ scope.row.cover.images[0] }}</span> -->
            <el-image :src="scope.row.cover.images[0]">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="280">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <!-- 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除 -->
            <!-- {{scope.row.status}} -->
            <el-tag v-if="scope.row.status===0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status===1" type="info">待审核</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
               style="margin-top:10px;"
               background
               layout="prev, pager, next"
               @current-change="hPageChange"
               :page-size="10"
               :total="total_count">
</el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  props: { },
  data () {
    return {
      form: {
        dateRange: null, // 表示一个时间区间
        delivery: false
      },
      tableData: [],
      total_count: 1, // 当前查询能查到的总条数
      curPage: 1 // 表示当前要查询页码
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      // 1. 拼接查询参数
      const queryObj = {
        page: this.curPage
      }
      // 检查用户是否选择了日期区域
      const { dateRange } = this.form
      if (dateRange) {
        // 当用户选择了日期区域之后，dateRange就是一个数组
        // 需要补充参数
        queryObj.begin_pubdate = dateRange[0]
        queryObj.end_pubdate = dateRange[1]
      }
      // 2. 发ajax获取数据
      const res = await this.$http({
        method: 'GET',
        // url: '/mp/v1_0/articles?page=' + this.curPage
        url: '/mp/v1_0/articles',
        // 请求类型是get，参数会以查询字符串的格式附加在url地址栏中。
        // http://ttapi.research.itcast.cn/mp/v1_0/articles?page=100
        // params: 是axios中约定的名字。
        params: queryObj
      })
      // 更新当前表格数据
      this.tableData = res.data.data.results
      // 更新总页数
      this.total_count = res.data.data.total_count
    },
    // 用户点击了分页
    hPageChange (curPage) {
      // alert(curPage)
      // 1. 更新页码
      this.curPage = curPage
      // 2. 重新发请求
      this.loadArticles()
    },
    Ysearch () {
      this.loadArticles()
    },
    ohandleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style scoped lang='less'>
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}
</style>
