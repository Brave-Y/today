<template>
  <el-form-item label="状态">
    <el-radio-group v-model="status" @change="hChange">
      <!-- 如果选择了全部，则将status设置为null,在发请求时，axios就是会自动忽略这个参数
      就不向后端传递 -->
      <el-radio :label="null">全部</el-radio>
      <el-radio :label="0">草稿</el-radio>
      <el-radio :label="1">待审核</el-radio>
      <el-radio :label="2">审核通过</el-radio>
      <el-radio :label="3">审核失败</el-radio>
      <el-radio :label="4">已删除</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'status',
  props: ['value'],
  data () {
    return {
      status: this.value // 用父组件中传递的数据，初始化
    }
  },
  methods: {
    hChange () {
      this.$emit('input', this.status)
    }
  }
}
</script>
