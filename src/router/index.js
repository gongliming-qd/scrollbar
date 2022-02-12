/*
 * @Author: glm
 * @Date: 2022-01-17 09:49:51
 * @LastEditors: your Name
 * @LastEditTime: 2022-02-09 12:04:49
 * @Description: 
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  
  {
    path: '/mindMap',
    component: () => import('../views/MindMap/mindMap.vue') 
  },
  {
    path: '/home',
    component: () => import('@/views/Home/index.vue') ,
    children: [
      {
        path: 'appendNew',
        component: () => import('@/views/Home/children/appendNew/index.vue') 
      },
      {
        path: 'myMindmap',
        component: () => import('@/views/Home/children/myMindmap/index.vue') 
      },
      {
        path: 'trash',
        component: () => import('@/views/Home/children/trash/index.vue') 
      },
      // {
      //   path: 'test',
      //   component: () => import('@/views/Home/children/test/index.vue') 
      // },
      {
        path: '',
        redirect: 'myMindmap'
      }
    ]

  },
  {
    path: '/myFiles',
    component: () => import('../views/MindMap/myFiles.vue')
  },
  {
    path: '/',
    redirect:'/home',
  },
  {
    path: '/supplierAllBack',
    component: () => import('@/components/supplierAllBack.vue') 
  },
  {
    path: '/errorBrowser',
    component: () => import('../views/errorBrowser.vue')
  },
]




const router = new VueRouter({ 
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router