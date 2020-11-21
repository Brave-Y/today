import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import './style/index.less'

// 引入axios
// @: 表示一个别名，它就指向src。
import axios from '@/utils/request.js'
// 把自己二次封装的axios挂载到vue的原型
// 好处在于，在所有的vue的组件都可以通过this.$http来访问
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
