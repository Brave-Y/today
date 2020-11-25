<template>
<div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 表单区域 -->
      <el-form class="login-form" ref="refForm" :model='form' :rules = 'rules'>
        <el-form-item prop='mobile'>
          <el-input v-model="form.mobile" placeholder='请输入手机号'></el-input>
        </el-form-item>
        <el-form-item prop='code'>
          <el-input v-model="form.code" placeholder='请输入密码'></el-input>
        </el-form-item>
        <el-form-item prop='isAgree'>
          <el-checkbox v-model="form.isAgree" label="我已阅读并同意用户协议和隐私条款" name="type"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button :Loading='isLoading' @click="Ylogin" v-model="form.isAgree" class="login-btn" type="primary">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// import axios from '@/utils/request.js'
export default {
  name: 'login',
  data () {
    return {
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur' }
        ],
        isAgree: [
          {
            validator: (rule, value, callback) => {
              // console.log('是否同意', value)
              // 如果检验通过 ，直接执行callback
              if (value) {
                callback()
              } else {
                callback(new Error('你必须同意，才能登陆'))
              }
              // if (value === '') {
              //   callback(new Error('请再次输入密码'));
              // } else if (value !== this.ruleForm2.pass) {
              //   callback(new Error('两次输入密码不一致!'));
              // } else {
              //   callback();
              // }
            },
            trigger: 'change'
          }
        ]
      },
      isLoading: false,
      form: {
        isAgree: false,
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    async doLogin () {
      // 1. 收集用户的信息
      const { mobile, code } = this.form
      // 2. axios发ajax请求
      this.isLoading = true // 正在请求
      try {
        const res = await this.$http({
          method: 'POST',
          url: 'mp/v1_0/authorizations',
          data: {
            mobile,
            code
          }
        })
        // -------------成功----------
        // 1. 提示
        this.$message.success('登陆成功')
        this.isLoading = false // 请求结束
        // 2. 把token保存到本地
        localStorage.setItem('tokenStr', res.data.data.token)
        // 3. 跳转到主页
        this.$router.push('/')
      } catch (err) {
        console.log(err)
        // alert('登陆失败')
        // eslint-disable-next-line no-proto
        // this.__proto__.__proto__.$message.error('错了哦，这是一条错误消息')
        this.$message.error('错了哦，这是一条错误消息')
        this.isLoading = false // 请求结束
      }
    },
    Ylogin () {
      // this.$refs.refForm是用来获取对表单组件的引用
      // 在表单组件有一个validate函数，它的实参是一个回调函数。
      // 这个回调函数会传入本次检验的结果，如果是true就去发请求
      this.$refs.refForm.validate(valid => {
        console.log('验证结果是', valid)
        if (valid) {
          this.doLogin()
        }
      })
    }
  }
}
// doLogin () {
//   // 1. 收集用户的信息
//   const { mobile, code } = this.form
//   // 2. axios发ajax请求
//   this.isLoading = true // 正在请求
//   this.$http({
//     method: 'POST',
//     url: 'mp/v1_0/authorizations',
//     data: {
//       mobile,
//       code
//     }
//   }).then(res => {
//     // alert('登陆成功')
//     this.$message.success('登陆成功')
//     this.isLoading = false // 请求结束
//     localStorage.setItem('tokenStr', res.data.data.token)
//     // 跳转页面
//     this.$router.push('/')
//   }).catch(err => {
//     console.log(err)
//     // alert('登陆失败')
//     // eslint-disable-next-line no-proto
//     // this.__proto__.__proto__.$message.error('错了哦，这是一条错误消息')
//     this.$message.error('错了哦，这是一条错误消息')
//     this.isLoading = false // 请求结束
//   })
//   // 3. 根据反馈结果，做后续操作
// },
</script>
<style scoped lang="less">
// 铺满整屏
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  background: url("../assets/login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("../assets/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
