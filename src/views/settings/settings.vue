<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <my-breadcrumb>个人设置</my-breadcrumb>
      </div>
<el-row>
        <el-col :span="16">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="hUpdate" type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <!-- 上传组件-->
         <el-upload
                  class="avatar-uploader"
                  action=""
                   :http-request="hUpload"
                  :show-file-list="false"
                  :before-upload="hBeforeUpload">
              <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
        </el-col>
      </el-row>
      <div>

        <!-- 右边是头像区域 -->
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'setting',
  data () {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tokenStr')}`
      },
      imageUrl: '',
      userInfo: {
        id: '',
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      }
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    // 自定义 实现 图像上传
    // 这个回调在上传文件时，自动被调用。它的参数是一个对象
    // 这个对象中有一个file属性表示当前要上传的文件
    async hUpload (obj) {
      try {
        const { file } = obj
        // console.log('自定义 实现 图像上传', file)
        // 上传文件一定要用formData
        const fd = new FormData()
        // 添加参数
        fd.append('photo', file)

        // 就是要实现文件上传
        const res = await this.$http({
          url: '/mp/v1_0/user/photo',
          method: 'PATCH',
          // 如果用formData去传参数，则请求头中content-type是：multipart-form-data.
          // 这个格式就是接口文档中要求的请求头的类型。
          data: fd
          // 如果用下面的普通的方式去传递参数，则请求头中的content-type是：application/json
          // data: {
          //   photo: file
          // }
        })
        this.$message.success('更新头像成功')
        console.log(res)
        // 1. 更新视图
        // 1.为userForm.photo重新赋值
        this.userInfo.photo = res.data.data.photo
        // 2.监听事件 更换头像
        this.$eventBus.$emit('update-user-info', { photo: res.data.data.photo })
      } catch (err) {
        console.log(err)
        // 2. 发布事件- layout.vue中的图像也要修改
        // this.$message.error('更新头像失败')
        // this.$eventBus.$emit('update-user-info', { photo: res.data.data.photo })
      }
    },
    async loadUserInfo () {
      const res = await this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'GET'
      })
      console.log('获取个人信息', res)
      this.userInfo.id = res.data.data.id
      this.userInfo.email = res.data.data.email
      this.userInfo.intro = res.data.data.intro
      this.userInfo.mobile = res.data.data.mobile
      this.userInfo.name = res.data.data.name
      this.userInfo.photo = res.data.data.photo
    },
    hUpdate () {
      // 保存数据
      // TODO:表单检验
      this.doSave()
    },

    async doSave () {
      const { name, intro, email } = this.userInfo
      try {
        const res = await this.$http({
          url: '/mp/v1_0/user/profile',
          method: 'PATCH',
          data: {
            name,
            intro,
            email
          }
        })
        console.log(res)
        this.$message.success('修改成功')

        // 发布事件
        this.$eventBus.$emit('update-user-info', { name })
      } catch (err) {
        console.log(err)
        this.$message.error('修改失败')
      }
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
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader {
    text-align: center;
  }
  .avatar{
    width: 300px;
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
