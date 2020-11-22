// 对axios进行二次封装
import axios from 'axios'
// 1. 设置基地址。
// http://www.axios-js.com/zh-cn/docs/#%E5%85%A8%E5%B1%80%E7%9A%84-axios-%E9%BB%98%E8%AE%A4%E5%80%BC
// 在真实接口地址中，域名部分一般就是固定的: http://ttapi.research.itcast.cn
// 可以把在固定这部分设为基地址：好处在于，后面再发ajax时，就可以省略这一段

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
// 2. 通过请求拦截器来统一设置token

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // config： 表示当前请求的配置
  console.log('有请求发出去了', Date.now(), config)
  // 如果当前有token保存在 localstorage，则把token添加到header中
  const tokenStr = localStorage.getItem('tokenStr')
  // config.headers.XXXXXX = '123131231312313121'
  if (tokenStr) {
    config.headers.Authorization = `Bearer ${tokenStr}`
  }
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// http://ttapi.research.itcast.cn/mp/v1_0/authorizations

export default axios
