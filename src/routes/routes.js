import { createRouter, createWebHistory } from 'vue-router'
import InspecciondeObra from '@/components/InspecciondeObra.vue'
import Home from '@/components/Home.vue'
import Obras from '@/components/Obras.vue'
import InicioSesion from '@/components/InicioSesion.vue'
import RegistroUsuario from '@/components/RegistroUsuario.vue'

const routes = [
  {
    path: '/',
    name: 'InicioSesion',
    component: InicioSesion,
  },
  {
    path: '/Registro',
    name: 'RegistroUsuario',
    component: RegistroUsuario,
  },
  {
    path: '/InspecciondeObra',
    name: 'InspecciondeObra',
    component: InspecciondeObra,
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
