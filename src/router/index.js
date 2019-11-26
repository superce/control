import Vue from 'vue'
import VueRouter from 'vue-router'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {title: '登录'},
    component: () => import('@/views/login/index.vue') //登录
  },
  {
    path:'/',
    name:'centralControl',
    meta:{title:'中控管理'},
    component:() => import('@/views/centralControl/index.vue')
  },
  {
    path:'/user_main',
    name:'userMain',
    meta:{title:'用户维护'},
    component:() => import('@/views/userMain/index.vue')
  },
  {
    path:'/task_quene',
    name:'taskQuene',
    meta:{title:'队列标识管理'},
    component:()=>import('@/views/taskQuene/index.vue')
  },
  {
    path:'/task_quene/tag',
    name:'tag',
    mete:{title:'队列标识管理'},
    component:()=>import('@/views/taskQuene/tag.vue')
  },
  {
    path:'/contorl_type',
    name:'controlType',
    meta:{title:'中控类型'},
    component:()=>import('@/views/controlType/index.vue')
  },
  {
    path: '/task_list',
    name: 'taskList',
    meta: {title: '任务列表'},
    component: () => import('@/views/taskList/index.vue') //登录
  },
  {
    path:'*',
    name:'404',
    component:() => import('@/views/404/404.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
