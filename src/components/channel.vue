<template>
  <el-form-item label="频道" prop="channelId">
    <el-select
      v-model="channelId"
      @change="hChange"
      placeholder="请选择频道">
      <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.name"
      :value="channel.id"></el-option>
      <!-- <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option> -->
    </el-select>
  </el-form-item>
</template>
<script>
//  1. 取回频道数据
//   - 根据接口文档,在加载组件时调用方法
//  2. 把数据显示在视图上。
//   - v-for循环绑定数据
export default {
  name: 'channel',
  props: ['value'],
  data () {
    return {
      channelList: [], // 所有的频道
      channelId: this.value // 当前选中的频道
    }
  },
  created () {
    this.loadChannels()
  },
  watch: {
    value: function (newVal, oldVal) {
      console.log('传入子组件中的value发生了变化', Date.now, newVal)
      this.channelId = newVal
    }
  },
  methods: {
    // 用户修改了频道
    hChange () {
      console.log('用户修改了频道', this.channelId)

      // this.$emit('change-channel', this.channelId)
      this.$emit('input', this.channelId)
    },
    async loadChannels () {
      // 发请求，获取频道列表数据
      const res = await this.$http({
        method: 'GET',
        url: '/mp/v1_0/channels'
      })
      this.channelList = res.data.data.channels
    }
  }
}
</script>
