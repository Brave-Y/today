<template>
  <div>
    <div class="btn_img" @click="hOpenDialog">
      <img :src="coverImageUrl"/>
    </div>
    <el-dialog
      title="封面"
      append-to-body
      :visible.sync="dialogVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="images">

          <div style="padding-bottom: 20px;">
            <el-radio-group v-model="isCollected" size="mini" @change="hToggle">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>
          <!-- 素材列表 -->
            <!-- 当前是否有selected这个类，要看当前的.url是否与selectedImageUrl相同 -->
          <el-row :gutter="10" class="img_list">
              <el-col
                class="img_item" :xs="12" :sm="6" :md="6" :lg="4"
                :class="{selected: image.url===selectedImageUrl}"
                v-for="image in images"
                @click.native="hSelectImage(image.url)"
                :key="image.id">
                  <el-image
                      style="height: 100px;"
                      :src="image.url"
                      fit="cover"></el-image>
              </el-col>
          </el-row>
          <!-- /素材列表 -->
          <!-- 分页组件 -->
          <el-pagination
            @current-change="hPageChange"
            background
            layout="prev, pager, next"
            :total="total_count">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传" name="upload">
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
            <el-image v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar"></el-image>

            <!-- 显示引导用户上传的 那个 + 号 -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="hConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from '@/assets/default.png'
export default {
  name: 'cover',
  props: ['value'],
  data () {
    return {
      // 如果用户传入了值，就显示，否则就用默认图
      // coverImageUrl: this.value ? this.value : defaultImg, // 显示在图片按钮上的图片
      coverImageUrl: this.value || defaultImg, // 显示在图片按钮上的图片
      // 设置上传时，需要用到token
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tokenStr')}`
      },
      uploadImageUrl: '', // 上传成功之后的预览图片地址
      // 用户选中的图片的地址
      // 当用户在图片上点击时，去更新这个值
      selectedImageUrl: '',
      // 素材库
      images: [],
      curPage: 1, // 当前是哪一页
      isCollected: false, //  是否收藏
      total_count: 0, // 总条数

      //
      dialogVisible: false,
      activeName: 'images' // 默认选中素材库
    }
  },

  methods: {
    // 用户点击了确认按钮
    hConfirm () {
      // 1. 保存当前用户选用(上传)的图片
      if (this.activeName === 'images') {
        // 素材库. 检查是否选中了图片
        if (this.selectedImageUrl) {
          // 2. 显示在图片按钮上
          this.coverImageUrl = this.selectedImageUrl
        } else {
          this.$message.error('请先选一张图片')
          return
        }
      } else {
        // 文件上传. 检查用户是否上传了图片
        if (this.uploadImageUrl) {
          this.coverImageUrl = this.uploadImageUrl
        } else {
          this.$message.error('请先上传一张图片')
          return
        }
      }
      // 3. 关闭dialog
      this.dialogVisible = false
      // 4. 抛出input事件，修改父组件中v-model绑定的值
      this.$emit('input', this.coverImageUrl)
    },
    // 上传成功之后
    hUploadSuccess (res, file) {
      // res中保存着本次上传操作成功后，后端接口返回的数值
      // 1. 预览效果
      this.uploadImageUrl = res.data.url
      // console.log('文件上传成功', res, file)
      this.$message.success('上传成功')
    },
    // 图片上传之前做一些检验
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
    // 用户在图片列表上点击，表示选中某张图
    hSelectImage (url) {
      this.selectedImageUrl = url
    },
    // 用户点击图片按钮，弹出对话框，同时去加载图片
    hOpenDialog () {
      this.dialogVisible = true
      this.uploadImageUrl = ''
      this.selectedImageUrl = ''
      this.loadImages()
    },
    // 切换 收藏 & 全部
    hToggle () {
      this.curPage = 1

      this.loadImages()
    },
    // 分页
    hPageChange (page) {
      // 1. 更新页码
      this.curPage = page
      // 2. 重发请求
      this.loadImages()
    },
    async loadImages () {
      try {
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
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style scoped lang='less'>
// 图片按钮
.btn_img {
  cursor: pointer;
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

// 素材列表
.img_list{
  margin-top: 15px;
  .img_item{
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}

  .selected::after{
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3) url(../assets/selected.png) no-repeat center / 50px 50px;
  }
// 素材列表

  .img_item{
   position: relative;
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
</style>
