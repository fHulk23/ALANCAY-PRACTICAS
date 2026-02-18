import { createRouter, createWebHistory } from 'vue-router'
import InspecciondeObra from '@/components/InspecciondeObra.vue'
import Regionales from '@/components/Regionales.vue' 
import Home from '@/components/Home.vue'
import Obras from '@/components/Obras.vue'

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
  },
  {
    path: '/Home', 
    name: 'Home',
    component: Home
  },
  {
    path: '/Obras', 
    name: 'Obras',
    component: Obras
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
