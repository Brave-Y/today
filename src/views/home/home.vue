<template>
  <div>
      Home
      <hr>
      <my-cover/>
    <my-cover v-model="image1"></my-cover>
    <my-cover v-model="image2"></my-cover>
  </div>
</template>
<script>
import MyCover from '@/components/cover.vue'
export default {
  name: 'Home',
  components: {
    MyCover
  },
  data () {
    return {
      image1: 'http://toutiao-img.itheima.net/FsiEfKkhRzgNzNENj-H9D4E9Gacb',
      image2: ''
    }
  }
}
</script>
