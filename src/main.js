// 根组件
import Vue from 'vue'
import App from './App.vue'
// 导入饿了么组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 路由文件
import router from './router'
import './style/index.less'
// 引入内容管理组件
import MyBreadcrumb from '@/components/breadcrumb.vue'
import MyChannel from '@/components/channel.vue'
import MyCover from '@/components/cover.vue'
// 引入axios
// @: 表示一个别名，它就指向src。
import axios from '@/utils/request.js'

// 注册全局组件--标题及面包屑
Vue.component('MyBreadcrumb', MyBreadcrumb)
Vue.component('MyChannel', MyChannel)
Vue.component('MyCover', MyCover)

// 引入json-bigint
// import JSONbig from 'json-bigint'
// const str = '{ "id": 1253585734669959168 }'
// console.log(JSON.parse(str)) // 1253585734669959200

// 把自己二次封装的axios挂载到vue的原型
// 好处在于，在所有的vue的组件都可以通过this.$http来访问
Vue.prototype.$http = axios

// 以插件格式引入饿了么
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
