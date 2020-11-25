<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header">
       <my-breadcrumb>素材管理</my-breadcrumb>
      </div>
<div style="padding-bottom:20px;">
        <!-- 对于数据项：collect: false
                当选中全部时，它的值是false
                当选中收藏时，它的值是true

            对于el-radio组件，可以通过label来设置当前项被中时的值
            :label="false" 表示一个布尔值 false
            label="false"  表示一个普通的字符串 'false'
        -->
        <el-radio-group v-model="isCollected" size="medium" @change="YToggle">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
         @click="dialogVisible=true"
         type="success" size="mini" style="float:right">上传图片素材          </el-button>
      </div>
      <!-- 素材列表 -->
<el-row :gutter="10">
        <el-col
        :span="4"
        v-for="image in images"
        :key="image.id"
        class="img_item">
          <el-image
            style="height: 180px;width: 180px"
            :src="image.url"
            fit="cover"
          ></el-image>
          <div class="option" v-show="!isCollected">
            <!-- 是否收藏 -->
<span
  :style="{color:image.is_collected ? 'red': '#fff'}"
  class="el-icon-star-off"
@click="hSwitchCollect(image)">
</span>
            <span class="el-icon-delete" @click="hDelete(image.id)"></span>
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
      <!-- 分页
        1.total: 一共有多少条数据 默认情况，它会以每页10条进行计算总页数
        2. current-change事件。当点击页码时，它会触发并会传入当前的页码。
      -->
      <el-pagination
        style="margin-top: 10px"
        background
        layout="prev, pager, next"
        @current-change="hPageChange"
        :total="total_count">
      </el-pagination>
    </el-card>

    <!--
      .sync可以用来做双向绑定
      append-to-body: 让对话框显示在最上层
    -->
<el-dialog
      append-to-body
      title="上传素材"
      :visible.sync="dialogVisible">
<!--
- action： 必选参数，上传的地址：http://ttapi.research.itcast.cn/mp/v1_0/user/images
- headers: 设置上传的请求头部。要携带token
- name：上传的文件字段名。要与接口中要求保持一致。
- show-file-list： 是否显示已上传文件列表
- on-success：文件上传成功时的钩子。`function(response, file, fileList)`
- before-upload: 上传之前对文件进行检测。 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :show-file-list="false"
        :before-upload="hBeforeUpload"
        :on-success="hUploadSuccess"
        >
        <!-- img用来显示上传成功之后的图像 -->
        <el-image v-if="imageUrl" :src="imageUrl" @load="hpreviewImageload" class="avatar" />
        <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
        <!-- 显示引导用户上传的 那个 + 号 -->
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>

      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Imagedata',
  data () {
    return {
      dialogVisible: false, // 是否显示弹出对话框
      isCollected: false, // 是否是 收藏的图片， true表示是收藏，false表示是全部
      curPage: 1, // 当前查询第几页
      total_count: 0, // 查询的总数量
      isCollect: false, // 是否是收藏的图片
      images: [], // 素材列表
      imageUrl: '', // 图片的预览地址。当上传成传会从后端返回的结果取出
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tokenStr')}`
      }
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    async loadImages () {
      // 发请求，获取数据，保存到images中
      const res = await this.$http({
        url: '/mp/v1_0/user/images',
        method: 'GET',
        params: {
          per_page: 10, // 固定每页只取回10条
          collect: this.isCollected, // 是否是收藏的图片
          page: this.curPage
        }
      })
      // 更新总条数
      this.total_count = res.data.data.total_count
      this.images = res.data.data.results
    },
    // 切换筛选条件
    YToggle () {
      console.log(this.isCollected)
      // 1. 更新页码 为1
      this.curPage = 1
      // 2. 发请求
      this.loadImages()
    },
    // 用户点击了分页
    hPageChange (page) {
      // 1. 更新页码
      this.curPage = page
      // 2. 重发请求
      this.loadImages()
    },
    // 上传成功
    hUploadSuccess (res, file) {
      // 1. 预览效果
      this.imageUrl = res.data.url
      // console.log('文件上传成功', res, file)
      // 2. 重新请求一次
      this.loadImages()
    },
    hBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      // file.size 单位是字节
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    hpreviewImageload () {
      // 表示图片预览成功
      console.log('图片预览成功', Date.now())
      setTimeout(() => {
        this.dialogVisible = false
        this.imageUrl = ''
      }, 2000)
    },
    // 切换是否收藏的状态
    async hSwitchCollect (image) {
      // image是当前用户选中收藏与否 时， 所操作那张图
      const imageId = image.id
      console.log(image)
      try {
        // 调用接口，传递参数
        const res = await this.$http({
          url: '/mp/v1_0/user/images/' + imageId,
          method: 'PUT',
          data: {
            // false-取消收藏，true-添加收藏
            collect: !image.is_collected
          }
        })
        console.log(res)
        this.$message.success('操作成功')
        // 更新页面
        // 有两种方式：1. 整体重发请求；2. 只更新当前的数据项
        // 修改数据，会引起视图的变化
        image.is_collected = !image.is_collected
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
    },
    async doDelete (id) {
      try {
        const res = await this.$http({
          url: '/mp/v1_0/user/images/' + id,
          method: 'DELETE'
        })
        this.$message.success('操作成功')
        // 更新页面
        console.log(res)
        // 发请求更新
        this.loadImages()
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
    },
    // 用户删除图像
    hDelete (id) {
      this.$confirm('你真的删除吗?').then(() => {
        this.doDelete(id)
      }).catch(() => {
        // 取消退出 . 这里不要删除了。如果删除了，promise的结构就不完整了，当用户点了取消之后
        // 就会报错误
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .img_item {
    position: relative;
    box-sizing: border-box;
  }
  .option {
    position: absolute;
    left: 5px;
    width:180px;
    bottom: 5px;
    height: 30px;
    line-height: 30px;
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    color: #fff;
    span {
      margin: 0 30px;
      cursor: pointer;
    }
  }
.avatar-uploader {
    text-align: center;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.red {
   color: red;
}
</style>
