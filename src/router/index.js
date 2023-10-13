import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Layout,
      redirect: '/add-invite',
      children: [
        {
          // 我的邀请
          path: '/my-invite',
          name: 'my-invite',
          component: () => import('@/views/invite/MyInvitePage.vue')
        },
        {
          // 新增邀请
          path: '/add-invite',
          name: 'add-invite',
          component: () => import('@/views/invite/InviteAddPage.vue')
        }
      ]
    },
    {
      // 某个邀请的详情
      path: '/invite-detail/:invite_id',
      component: () => import('@/views/invite/InviteDetailPage.vue')
    },
    {
      // 访客到达-扫描页面
      // 这个路由，是任何人可以访问的，比如：访客自己、门卫
      path: '/invite-arrive/:invite_id',
      component: () => import('@/views/invite/InviteArrivePage.vue')
    }
  ]
})

export default router
