import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginIndex from '../views/login/LoginIndex'
import LayoutIndex from '../views/layout/LayoutIndex'
import HomeIndex from '../views/home/HomeIndex'
import QaIndex from '../views/qa/QaIndex'
import VideoIndex from '../views/video/VideoIndex'
import MyIndex from '../views/my/MyIndex'
import SearchPage from '../views/search/SearchIndex'
import ArticleIndex from '../views/article/ArticleIndex'
import UserProfile from '../views/user-profile/UserIndex'
Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/home',
    component: LayoutIndex,
    children: [
      { path: '/home', name: 'home', component: HomeIndex },
      { path: '/qa', name: 'qa', component: QaIndex },
      { path: '/video', name: 'video', component: VideoIndex },
      { path: '/my', name: 'my', component: MyIndex }
    ]

  },
  {
    path: '/login',
    name: 'login',
    component: LoginIndex

  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: ArticleIndex,
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: UserProfile
  }
]

const router = new VueRouter({
  routes
})

export default router
