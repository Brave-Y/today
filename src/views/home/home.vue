<template>
  <div>
    home
    <hr>
    <my-cover v-model="img1Url"/> <my-cover v-model="img2Url"/>
  </div>
</template>

<script>
import MyCover from '@/components/cover.vue'
export default {
  data () {
    return {
      img1Url: '',
      img2Url: 'http://toutiao-img.itheima.net/FiKuaDKfVRYNLDbboGp6qbSnVC-N'
    }
  },
  components: {
    MyCover
  }
}
</script>

<style>

</style>
