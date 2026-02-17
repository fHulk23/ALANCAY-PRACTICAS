import InspecciondeObra from '@/components/InspecciondeObra.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
      path: '/InspecciondeObra',
      name: 'InspecciondeObra',
      component: InspecciondeObra,
    }
  ];
  
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), 
    routes,
  });
  
  export default router;