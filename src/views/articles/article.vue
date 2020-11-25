<template>
  <div >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航
        https://element.eleme.cn/#/zh-CN/component/breadcrumb#tu-biao-fen-ge-fu -->
        <my-breadcrumb>内容管理</my-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <my-status v-model="form.status"></my-status>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
             <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <my-channel ref=relchannel></my-channel>
        <!-- <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="频道一" value="shanghai"></el-option>
            <el-option label="频道二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
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
          <el-button type="primary" @click="Ysearch" :loading="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top:1em">
      <div slot="header" class="clearfix">
       根据筛选条件查询到{{total_count}}条数据,当前是第{{curPage}}页：
      </div>
      <el-table
        :data="articles"
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
              @click="hEdit(scope.$index, scope.row)"></el-button>
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
import MyChannel from '@/components/channel.vue'
import MyStatus from '@/components/status.vue'
// import MyBreadcrumb from '@/components/breadcrumb'
export default {
  name: 'ArticleList',
  props: { },
  components: {
    MyChannel,
    MyStatus
    // MyBreadcrumb
  },
  data () {
    return {
      form: {
        dateRange: null, // 表示一个时间区间
        status: null
      },
      isLoading: false,
      articles: [],
      total_count: 1, // 当前查询能查到的总条数
      curPage: 1 // 表示当前要查询页码
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    getCond () {
      const { dateRange, status } = this.form
      const queryObj = {
        page: this.curPage,
        status
      }
      // 1) 检查用户是否选择了日期区域
      if (dateRange) {
        // 当用户选择了日期区域之后，dateRange就是一个数组
        // 需要补充参数
        queryObj.begin_pubdate = dateRange[0]
        queryObj.end_pubdate = dateRange[1]
      }
      // 2) 检查是否选中了频道
      // 由于在created时，就会调用一次查询，而此时，子组件并没有创建出来
      // 所以this.$refs.refChannel是不存在的
      if (this.$refs.refChannel && this.$refs.refChannel.channelId) {
        queryObj.channel_id = this.$refs.refChannel.channelId
        console.log('频道下拉中选中的是：', this.$refs.refChannel.channelId)
      } else {
        queryObj.channel_id = null
      }
      return queryObj
    },
    async loadArticles () {
      // 1. 拼接查询参数
      const queryObj = this.getCond()
      // 2. 发ajax获取数据
      //   2.1 更改loading
      this.isLoading = true
      try {
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
        this.articles = res.data.data.results
        // 更新总页数
        this.total_count = res.data.data.total_count
        // 恢复loading状态
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.$message.error('获取数据失败')
        // 更新当前表格数据
        this.articles = []
        // 更新总页数
        this.total_count = 0
        // 恢复loading状态
        this.isLoading = false
      }
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
    hEdit (index, row) {
      // 1. 获取id
      const idStr = row.id.toString()
      // 2. 传一个字符串
      this.$router.push('/edit/' + idStr)
    },
    async doDelete (idObj) {
      console.log('你要删除的数据的id是', idObj.toString())
      // 发ajax做删除
      try {
        const res = await this.$http({
          method: 'DELETE',
          url: '/mp/v1_0/articles/' + idObj.toString()
        })
        console.log(res)
        // 1. 提示
        this.$message.success('删除成功')
        // 2. 重新加载数据
        this.loadArticles()
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },
    // 用户点击删除
    handleDelete (index, row) {
      console.log(index, row)
      // 1. 让用户确认是否真的要删除
      // 问一下：是否要退出
      this.$confirm('你真的要删除吗?').then(() => {
        // 确定删除
        this.doDelete(row.id)
      }).catch(() => {
        // 取消退出 . 这里不要删除了。如果删除了，promise的结构就不完整了，当用户点了取消之后
        // 就会报错误
      })
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
