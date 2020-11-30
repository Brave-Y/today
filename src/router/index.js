import Vue from 'vue'
import VueRouter from 'vue-router'

// 主页与登录页
const login = () => import('../views/login.vue')
const Layout = () => import('../views/layout.vue')
// 文章管理页
const Article = () => import('../views/articles/article.vue')
// 素材管理
const image = () => import('../views/image/image.vue')
// 编辑
const edit = () => import('../views/articles/edit.vue')
// 添加页
const AddArticle = () => import('../views/articles/add.vue')
// 评论管理
const Comment = () => import('../views/comment/comment.vue')
// 粉丝管理
const Fans = () => import('../views/fans/fans.vue')
// 个人设置
const Settings = () => import('../views/settings/settings.vue')
// home
const Home = () => import('../views/home/home.vue')
// 404
const Page404 = () => import('../views/page404/page404.vue')

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: '/articles', component: Article },
      { path: '/image', component: image },
      { path: '/addArticle', component: AddArticle },
      { path: '/comment', component: Comment },
      { path: '/fans', component: Fans },
      { path: '/settings', component: Settings },
      // 动态路由
      { path: '/edit/:id', component: edit }
    ]
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '*', component: Page404
  }
]

const router = new VueRouter({
  routes
})

export default router

// 路由导航守卫
//   所有的路由页面中跳转，都会先进入到这个函数中来。
// to: 要跳入的路由信息。  你要去哪里
// from: 要跳出的路由信息。你从哪里来
// next: 是一个函数，放行方法
//   - next() : 正确跳转。允许进入到 to 路由
//   - next(路由地址) : 不允许去to，而转去指定的路由地址
router.beforeEach((to, from, next) => {
  console.log(Date.now(), '路由跳转了')
  console.log(to, from, next)
  // 如果你要去的页面是 "VIP" 页面
  const pageList = ['/', '/image', '/articles', '/addArticle']
  // if (to.path === '/image' || to.path === '/article') {
  if (pageList.includes(to.path)) {
    // 1. 获取token
    const tokenStr = localStorage.getItem('tokenStr')
    if (tokenStr) {
      next() // 放行
    } else {
      console.log('大胆狂徒，没有VIP，这里不让你进！！！！！')
      next('/login')
    }
  } else {
    next() // 放行
  }
})
