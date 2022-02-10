import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

export default createRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'about',
      path: '/about',
      component: () => import('../pages/About.vue')
    }
  ],
  history: createWebHistory(import.meta.env.BASE_URL)
})
