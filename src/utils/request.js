// 对axios进行二次封装
import axios from 'axios'
// 引入json-bigint包
import JSONbig from 'json-bigint'
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

// 3. 在transformResponse中处理大数问题
axios.defaults.transformResponse = [function (data) {
  // 做任意处理
  try {
    // 由于jsonbig.parse只能处理json字符串，如果后端返回的数据是不是json字符串，这里就
    // 可能会出错，所以 要try
    return JSONbig.parse(data)
  } catch (err) {
    console.log('transformResponse出错了', err)
    return data
  }
}]
// http://ttapi.research.itcast.cn/mp/v1_0/authorizations

export default axios
