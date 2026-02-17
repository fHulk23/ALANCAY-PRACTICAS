import { createRouter, createWebHistory } from 'vue-router'
import InspecciondeObra from '@/components/InspecciondeObra.vue'
import Regionales from '@/components/Regionales.vue' 

const routes = [
  {
    path: '/InspecciondeObra',
    name: 'InspecciondeObra',
    component: InspecciondeObra,
  },
  {
    path: '/regionales', 
    name: 'Regionales',
    component: Regionales,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
