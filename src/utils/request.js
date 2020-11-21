// 对axios进行二次封装
import axios from 'axios'
// 1. 设置基地址。
// http://www.axios-js.com/zh-cn/docs/#%E5%85%A8%E5%B1%80%E7%9A%84-axios-%E9%BB%98%E8%AE%A4%E5%80%BC
// 在真实接口地址中，域名部分一般就是固定的: http://ttapi.research.itcast.cn
// 可以把在固定这部分设为基地址：好处在于，后面再发ajax时，就可以省略这一段

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'

// http://ttapi.research.itcast.cn/mp/v1_0/authorizations

export default axios
