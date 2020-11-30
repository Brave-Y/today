<template>
  <div class='article-container'>
    <el-card class="box-card">
      <!-- 标题 -->
      <div slot="header" class="clearfix">
        <my-breadcrumb>评论管理</my-breadcrumb>
      </div>
      <!-- 主体表格 -->
<el-table
      :data="comments"
      >
      <el-table-column label="文章标题" prop="title">
      </el-table-column>
      <el-table-column label="总评论数" prop="total_comment_count">
      </el-table-column>
      <el-table-column label="粉丝评论数" prop="fans_comment_count">
      </el-table-column>
      <el-table-column label="评论状态">
        <template slot-scope="scope">
          <!-- {{scope.row.comment_status}} -->
          <el-tag v-if="scope.row.comment_status" type="success">正常</el-tag>
          <el-tag v-else type="error">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <button>打开/关闭评论</button> -->
 <el-button size="mini" @click="hToggleStatus(scope.row)" v-if="scope.row.comment_status" type="danger">关闭</el-button>
          <el-button size="mini" @click="hToggleStatus(scope.row)" v-else type="primary">打开</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 1em;"
      background
      :page-size="10"
      @current-change="hPageChange"
      layout="prev, pager, next"
      :total="total_count">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
// import MyBreadcrumb from '../../components/MyBreadcrumb'

export default {
  name: 'CommentIndex',
  props: { },
  components: {
    // MyBreadcrumb
  },
  data () {
    return {
      page: 1, // 当前的页数
      total_count: 0, // 总数据
      comments: [
        { title: '测试标题', num1: 111 }
      ]
    }
  },
  created () {
    this.loadComments()
  },
  methods: {
    hPageChange (curpage) {
      // 更新页码
      this.page = curpage
      // 重发请求
      this.loadComments()
    },
    async loadComments () {
      const res = await this.$http({
        url: '/mp/v1_0/articles',
        method: 'GET',
        params: {
          page: this.page,
          response_type: 'comment'
        }
      })
      console.log(res)
      this.comments = res.data.data.results
      this.total_count = res.data.data.total_count
    },
    // 切换状态
    async hToggleStatus (row) {
      console.log(row)
      try {
        const res = await this.$http({
          url: '/mp/v1_0/comments/status',
          method: 'PUT',
          params: {
            // 大数，要加toString
            article_id: row.id.toString()
          },
          data: {
            // 取反
            allow_comment: !row.comment_status
          }
        })
        console.log(res)
        this.$message.success('操作成功')

        // 更新页面
        // 1. 重新加载当前这一页的数据
        // this.loadComments()
        // 2. 更新本地数据： 只局部更新当前行的数据
        row.comment_status = !row.comment_status
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>

</style>
