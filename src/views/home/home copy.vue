<template>
  <div>
    <cover v-model="image1"></cover>
    <cover v-model="image2"></cover>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      image1: 'http://toutiao-img.itheima.net/FsiEfKkhRzgNzNENj-H9D4E9Gacb',
      image2: ''
    }
  }
}
</script>
